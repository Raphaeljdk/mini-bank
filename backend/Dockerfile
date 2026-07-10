FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
# Forçar download limpo das dependências
RUN mvn dependency:purge-local-repository -DmanualInclude=com.minibank -DreResolve=false || true
RUN mvn clean compile -U
COPY src ./src
RUN mvn package -DskipTests -U

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
