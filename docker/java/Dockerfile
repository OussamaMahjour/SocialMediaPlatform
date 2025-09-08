# ---- Build Stage ----
FROM maven:3.9.8-amazoncorretto-17 AS builder
WORKDIR /app

# 1. Copy only pom.xml first (better caching)
COPY pom.xml .

# 2. Pre-download dependencies using cache mount
RUN --mount=type=cache,target=/root/.m2 \
    mvn -B dependency:go-offline

# 3. Copy project sources
COPY src ./src

# 4. Build project using the same cache
RUN --mount=type=cache,target=/root/.m2 \
    mvn -B clean package -DskipTests

# ---- Runtime Stage ----
FROM amazoncorretto:17-alpine-jdk
WORKDIR /app

COPY --from=builder /app/target/*.jar ./app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
