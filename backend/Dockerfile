# ── ETAPA 1: Compilar el proyecto ──────────────────────────────────────
# Usamos una imagen que tiene Java 17 + Maven para compilar
FROM eclipse-temurin:17-jdk-alpine AS build

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos primero el pom.xml solo (para aprovechar el caché de Docker)
# Si el código cambia pero el pom.xml no, Docker no vuelve a descargar dependencias
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Descarga todas las dependencias (usa caché si pom.xml no cambió)
RUN ./mvnw dependency:go-offline -B

# Ahora sí copiamos el código fuente
COPY src ./src

# Compilamos y empaquetamos, saltando los tests para ser más rápido
RUN ./mvnw package -DskipTests

# ── ETAPA 2: Imagen final (más liviana, sin Maven) ─────────────────────
# Solo necesitamos Java para EJECUTAR el .jar, no para compilar
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiamos el .jar generado en la etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Documentamos que usamos el puerto 8080
EXPOSE 8080

# Comando que se ejecuta al iniciar el contenedor
ENTRYPOINT ["java", "-jar", "app.jar"]