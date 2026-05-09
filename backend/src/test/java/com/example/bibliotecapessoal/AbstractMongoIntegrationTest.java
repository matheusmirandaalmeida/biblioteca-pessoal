package com.example.bibliotecapessoal;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@Testcontainers
public abstract class AbstractMongoIntegrationTest {

    @Container
    @ServiceConnection
    static final MongoDBContainer MONGO_DB_CONTAINER = new MongoDBContainer("mongo:7.0");
}
