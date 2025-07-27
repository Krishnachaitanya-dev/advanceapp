
#!/bin/bash

echo "Fixing Gradle wrapper..."

# Create wrapper directory if it doesn't exist
mkdir -p gradle/wrapper

# Download the Gradle wrapper JAR if it doesn't exist
if [ ! -f "gradle/wrapper/gradle-wrapper.jar" ]; then
    echo "Downloading Gradle wrapper JAR..."
    curl -L -o gradle/wrapper/gradle-wrapper.jar https://services.gradle.org/distributions/gradle-8.11.1-wrapper.jar
    echo "Gradle wrapper JAR downloaded."
else
    echo "Gradle wrapper JAR already exists."
fi

# Make gradlew executable
chmod +x gradlew

echo "Gradle wrapper fixed!"
echo "You can now run: ./gradlew --version"
