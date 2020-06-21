import os
from datetime import datetime
from jinja2 import Environment, FileSystemLoader
from markdown2 import markdown


POSTS = {}

for markdown_post in os.listdir('content/articles'):
    file_path = os.path.join('content/articles', markdown_post)

    with open(file_path, 'r') as file:
        POSTS[markdown_post] = markdown(file.read(), extras=['metadata', 'fenced-code-blocks', 'code-friendly', 'cuddled-lists'])
        

POSTS = {
    post: POSTS[post] for post in sorted(POSTS, key=lambda post: datetime.strptime(POSTS[post].metadata['date'], '%d.%m.%Y'), reverse=True)
}

env = Environment(loader=FileSystemLoader('templates'))
home_template = env.get_template('home.html')
post_template = env.get_template('article.html')
contact_template = env.get_template('contact.html')
about_template = env.get_template('about.html')

today = (datetime.today()).year

# home convertion
posts_metadata = [POSTS[post].metadata for post in POSTS]

home_html = home_template.render(posts=posts_metadata, today=today)

with open('output/home.html', 'w') as file:
  file.write(home_html)

# Posts convertion
for post in POSTS:
  post_metadata = POSTS[post].metadata

  post_data = {
    'content': POSTS[post],
    'title': post_metadata['title'],
    'date': post_metadata['date']
  }

  post_html = post_template.render(post=post_data)
  post_file_path = 'output/posts/{slug}.html'.format(slug=post_metadata['slug'], today=today)

  os.makedirs(os.path.dirname(post_file_path), exist_ok=True)
  with open(post_file_path, 'w') as file:
    file.write(post_html)
    
# contact convertion    
with open('content/contact.md', 'r') as contact:
  contact_data = markdown(contact.read(), extras=['metadata'])
  contact_html = contact_template.render(content=contact_data)
  contact_file_path = 'output/contact.html'
  with open(contact_file_path, 'w') as file:
    file.write(contact_html)

# about convertion
with open('content/about.md', 'r') as about:
  about_data = markdown(about.read(), extras=['metadata'])
  about_html = about_template.render(content=about_data)
  about_file_path = 'output/about.html'
  with open(about_file_path, 'w') as file:
    file.write(about_html)