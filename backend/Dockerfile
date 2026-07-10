FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENV SPRING_DATASOURCE_URL=jdbc:h2:mem:minibank;DB_CLOSE_DELAY=-1
ENV SPRING_DATASOURCE_USERNAME=sa
ENV SPRING_DATASOURCE_PASSWORD=
ENV SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.h2.Driver
ENV SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.H2Dialect
ENV SPRING_JPA_HIBERNATE_DDL_AUTO=update
ENV SPRING_FLYWAY_ENABLED=false
ENTRYPOINT ["java", "-jar", "app.jar"]
