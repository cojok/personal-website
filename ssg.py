import os
import subprocess
from datetime import datetime
from jinja2 import Environment, FileSystemLoader
from markdown2 import markdown
from css_html_js_minify import process_single_html_file

POSTS = { }

for markdown_post in os.listdir('content/articles'):
  file_path = os.path.join('content/articles', markdown_post)

  with open(file_path, 'r') as file:
    POSTS[markdown_post] = markdown(file.read(),
                                    extras = ['metadata', 'fenced-code-blocks'])

POSTS = {
  post: POSTS[post] for post in sorted(POSTS, key = lambda post: datetime.strptime(POSTS[post].metadata['date'],
                                                                                   '%d.%m.%Y'), reverse = True)
}

env = Environment(loader = FileSystemLoader('templates'))
home_template = env.get_template('home.html')
post_template = env.get_template('article.html')
contact_template = env.get_template('contact.html')
about_template = env.get_template('about.html')
template_404 = env.get_template('404.html')

today = (datetime.today()).year

# home convertion
posts_metadata = [POSTS[post].metadata for post in POSTS]
tmp_posts_metadata = posts_metadata

chunk = 5
page = 1

for i in range(len(tmp_posts_metadata)):
  if i % chunk == 0 and i != 0:
    page += 1
    chunk += 5
  posts_metadata[i]['page'] = page

home_html = home_template.render(posts = posts_metadata, today = today, title='Home page', author='Flavius '
                                                                                                  'Cojocariu',
                                 summary='Home page of the personal website of Flavius Cojocariu')

with open('output/home.html', 'w+') as file:
  file.write(home_html)

# 404 convertion
html_404 = template_404.render()

with open('output/404.html', 'w+') as file:
  file.write(html_404)

# Posts convertion
for post in POSTS:
  post_metadata = POSTS[post].metadata

  post_data = {
    'content': POSTS[post],
    'title': post_metadata['title'],
    'author': post_metadata['author'],
    'date': post_metadata['date']
  }

  post_html = post_template.render(post = post_data, title=post_metadata['title'], author=post_metadata['author'],
                                   summary=post_metadata['summary'])
  post_file_path = 'output/posts/{slug}.html'.format(slug = post_metadata['slug'], today = today)

  os.makedirs(os.path.dirname(post_file_path), exist_ok = True)
  with open(post_file_path, 'w+') as file:
    file.write(post_html)

# contact convertion    
with open('content/contact.md', 'r') as contact:
  contact_data = markdown(contact.read(), extras = ['metadata'])
  contact_html = contact_template.render(content = contact_data, title='Contact Page', author='Flavius Cojocariu',
                                         summary='This is the contact page of the personal website of Flavius '
                                                     'Cojocariu')
  contact_file_path = 'output/contact.html'
  with open(contact_file_path, 'w+') as file:
    file.write(contact_html)

# about convertion
with open('content/about.md', 'r') as about:
  about_data = markdown(about.read(), extras = ['metadata'])
  about_html = about_template.render(content = about_data, title='About Page', author='Flavius Cojocariu',
                                     summary='About page of the personal website of Flavius Cojocariu')
  about_file_path = 'output/about.html'
  with open(about_file_path, 'w+') as file:
    file.write(about_html)

# minify the js and css
subprocess.run('npm run minifyJS', shell = True, check = True)
subprocess.run('npm run concat:css', shell = True, check = True)
subprocess.run('npm run minifyCSS', shell = True, check = True)

# testing minify html
for html in os.listdir('./output/'):
  if os.path.isdir('./output/{}'.format(html)):
    for html_2 in os.listdir('./output/{}'.format(html)):
      process_single_html_file('./output/{}/{}'.format(html, html_2), overwrite = True)
  else:
    process_single_html_file('./output/{}'.format(html), overwrite = True)
