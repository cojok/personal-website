---
title: Basic setup of a debian buster(10) server with nginx and ssl 
date: 02.08.2020
tags: debian, server, nginx, firewall, ssl
author: Flavius Cojocariu
summary: A small tutorial on how to make a basic setup of a debian buster(10) server for web development with nginx, ssl and firewall.
slug: debian-10-nginx-ssl-server
---

## What will gonna do?

I will show you in the tutorial how to setup a basic server. The OS running the server will be **debian buster** ***(debian v10)***, **nginx** as the webserver, **let's encrypt** ssl certificate done with **certbot** and small **ufw** firewall config.
This tutorial assumes that you have some knowledge about the terminology that will be used and the focus will be done only on the configuration part and not explaining the terminology.

## Configuring the debian buster(v10) server

>***NOTE*** The bash commands assume you are logged in your server as a root user.

Connect to the server via ssh, if the configuration is for local machine/host igonore this step.
```bash
$ ssh user@server-ip-address
```
The first thing to do after a fresh install is to make sure the OS is up-to-date. The first command is to check whether the installed packages need to be upgraded or not.
```bash
$ apt update

$ apt upgrade -y
```

I really like to use the zsh as my terminal on the OS, even if it is MacOS or some Linux Distro. In addition I always install the oh-my-zsh framework as well.
For installing the oh-my-zsh framework we need to make sure the server has git and curl installed. You can use instead of curl wget, but I prefer curl.
```bash
$ apt install zsh -y

$ apt install git -y

$ apt install curl -y
```

in order to install the oh-my-zsh framework we need to make sure the terminal now is using zsh.
```bash
$ chsh -s $(which zsh)

$ exec bash

$ echo $SHELL
``` 
the **echo** should output: **/usr/bin/zsh**

Now let's install the oh-my-zsh framework:
```bash
$ sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

for more insights check the [oh-my-zsh](https://ohmyz.sh/)

Normally you might get with the fresh installation of debian nano text editor. I do not really like this editor, and I will prefer to use neovim for doing my on server editing.
I prefer neovim because as a development machine I use a macbook, and therefor noevim is easier to be configured than vim or macvim.
```bash
$ apt install neovim -y
```

To open files in neovim just use the following command:
```bash
$ nvim file_name.extension
```

Next thing to do to finish this basic setup is to add some firewall to debian. I will be using the ufw firewall package. 
```bash
$ apt install ufw -y
```

Next let's add a rule for ssh and enable it.
```bash
$ ufw allow OpenSSH

$ ufw enable
```

## Configuring Nginx

Let's install nginx first and then add it to the ufw firewall rules. For the moment we are going to allow the over the firewall the nginx over port :80(http).
```bash
$ apt install nginx

$ ufw allow Nginx HTTP
```

After successfully installing nginx let's check if the default page opened in the browser. Check the status and grab servers ip address.
```bash
$ systemctl status nginx

$ ip addr show eth0 | grep inet | awk '{ print $2; }' | sed 's/\/.*$//'
```

### Useful Nginx commands

Check the status of the web server.
```bash
$ systemctl status nginx
```

Restart/reload the web server.
```bash
$ systemctl reload nginx

$ systemctl restart nginx
```

Stop the web server.
```bash
$ systemctl stop nginx
```

Start the web server.
```bash
$ systemctl start nginx
```

## Configure custom root folder and domain for your server

Now that everything is running, lets change the default nginx configuration and add a custom domain for your server. First of all add a DNS record in to the admin panel of your domain manager.

| Type | Name |          Value         |  TTL   |
|:----:|:----:|:----------------------:|:------:|
|  A   |   @  |ip_address_of_you_server| 1 Hour |

Create basic nginx config. For us to be able to make a configuration for our domain let's create first the config file.
```bash
$ nvim /etc/nginx/sites-available/your_domain
```

Inside the new file hit **i** so you enter edit mode in nvim and add:
```nginx
server {
        listen 80;
        listen [::]:80;

        root /var/www/your_domain/;
        index index.html index.htm index.nginx-debian.html;

        server_name your_domain;

        location / {
                try_files $uri $uri/ =404;
        }
}
```

Now lets uncomment this line in ***/etc/nginx/nginx.conf***
```bash
server_names_hash_bucket_size 64;
```

We need now to create a symlink to the config file created inside sites-available into sites-enabled.
```bash
$ ln -s /etc/nginx/sites-available/your_domain /etc/nginx/sites-enabled
```

Now lets check if the configurations we've done are correct and then restart nginx.
```bash
$ nginx -t

$ systemctl relaod nginx
 
$ systemctl status nginx
```

Before we can check the domain in the browser to see if it shows the content of the server, let's add a tiny html page to be sure everything is being displayed correctly in the browser.
```bash
$ nvim /var/www/your_domain/index.html
```

Copy this into the ***index.html***
```html
<html>
    <head>
        <title>Welcome to your_domain</title>
    </head>
    <body>
        <h1>This page ios served by Nginx on the domain: <em>your_domain</em>. </h1>
    </body>
</html>
```

## Adding let's encrypt free TSL/SSL

First of all we need to install a bunch of packages.
```bash
$ apt install python3-acme python3-certbot python3-mock python3-openssl python3-pkg-resources python3-pyparsing python3-zope.interface

$ apt install python3-certbot-nginx
```

Let's add nginx https over to the firewall rules. Now everything is up to you how you wanna do this. First command will help you identify what you can use as a rule.
```bash
$ ufw app list

$ ufw allow Nginx FULL

$ ufw status
```

Almost done. Right now you need to obtain the certificate for your_domain.
```bash
$ certbot --nginx -d your_domain
```

If certbot was successful, you'll be asked about some redirects. Read that section carefully, and if the website is brand-new then number 12 should be fine.

If you want to get a certificate also for www.your_domain then add it to the command and to the site-available/your_domain config.
```bash
$ certbot --nginx -d your_domain -d www.your_domain

$ nvim /etc/nginx/sites-available/your_domain
```

Inside site-available/your_domain config change line to this.
```bash
server_name your_domain www.your_domain;
```

After everything is done, just check if the renewal of the certificate can happen automatically.
```bash
$ certbot renew --dry-run
```

## Final thoughts

I hope this tutorial helped you in successfully have an up and running server, pointing to your domain and served with a certificate. 
I will try to write more tutorials in this style, but sometimes time is the limit.

Until next time I wish you: <br>
Enjoy life and always be curios.
