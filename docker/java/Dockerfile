FROM amazoncorretto:17-alpine-jdk

WORKDIR /app
RUN apk update

RUN apk add  bash curl jq wget maven

COPY ./target/*.jar ./app.jar




EXPOSE 8080

ENTRYPOINT [ "java","-jar","/app/app.jar" ]