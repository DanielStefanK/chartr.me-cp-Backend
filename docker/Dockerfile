FROM debian:jessie
MAINTAINER balint.sera@gmail.com
# image: customrepo/docker-builder

RUN apt-get update -y
RUN apt-get install -y curl ssh-client


# docker
ENV DOCKER_BUCKET get.docker.com
ENV DOCKER_VERSION 17.06.2-ce

RUN set -x \
	&& curl -fSL "https://download.docker.com/linux/static/stable/x86_64/docker-${DOCKER_VERSION}.tgz" -o docker.tgz \
	&& tar -xzvf docker.tgz \
	&& mv docker/* /usr/local/bin/ \
	&& rmdir docker \
	&& rm docker.tgz \
	&& docker -v


CMD top