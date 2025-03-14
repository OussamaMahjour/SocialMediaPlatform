package com.oussama.SocialMedia.user_service;

import com.oussama.SocialMedia.user_service.entity.User;
import com.oussama.SocialMedia.user_service.repository.Repository;
import io.restassured.RestAssured;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.containers.MySQLContainer;

import java.util.List;

import static io.restassured.RestAssured.given;
import static io.restassured.RestAssured.post;
import static io.restassured.RestAssured.get;
import static io.restassured.RestAssured.put;
import static io.restassured.RestAssured.delete;



import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class UserServiceApplicationTests {



	@LocalServerPort
	private Integer port;

	@Container
	static MySQLContainer<?> mySQLContainer = new MySQLContainer<>("mysql:9.2")
			.withUsername("mysql")
			.withPassword("root")
			.withDatabaseName("user_service_db");
	@BeforeAll
	static void beforeAll() {
		mySQLContainer.start();

	}

	@AfterAll
	static void afterAll() {
		mySQLContainer.stop();
	}

	@DynamicPropertySource
	static void configureProperties(DynamicPropertyRegistry registry) {
		registry.add("spring.datasource.url", mySQLContainer::getJdbcUrl);
		registry.add("spring.datasource.username", mySQLContainer::getUsername);
		registry.add("spring.datasource.password", mySQLContainer::getPassword);

	}

	@Autowired
	private Repository userRepository;

	@Test
	void contextLoads() {
	}

	@BeforeEach
	void setUp() {
		RestAssured.baseURI = "http://localhost:" + port;
	}

	@Test
	void shouldGetAllUsers(){
		get("/api/v1/users")
				.then()
				.statusCode(200)
				.log()
				.ifValidationFails();
			//	.body(".",hasSize(10));
	}




	@Test
	void shouldCreatUser(){
		String user = """
				{
						    "username":"MimicDom",
						    "firstname": "Jacki",
						    "lastname": "shane",
						    "about": "Senior  developer",
						    "phone": 1234567898,
						    "email": "jacki.shane@example.com",
						    "gender": "MALE",
						    "birthday": "1945-06-11"
						}
				""";
		given().log()
				.ifValidationFails()
				.when()
				.contentType("application/json")
				.body(user)
				.post("/api/v1/users")
				.then()
				.statusCode(200);
			//	.body(".",equalTo(user));

		;
	}

	@Test
	void shouldUpdateUser(){
		String user = """
				{
				        "username": "BugHunter3000",
				        "firstname": "John",
				        "lastname": "Doe",
				        "about": "Software senior developer",
				        "phone": 1234567890,
				        "email": "john.doe@example.com",
				        "gender": "MALE",
				        "birthday": "1995-06-15"
				    }
				""";
		given()
				.log()
				.ifValidationFails()
				.when()
				.body(user)
				.contentType("application/json")
				.put("/api/v1/users")
				.then()
				.statusCode(200)
			//	.body(".",equalTo(user));
				.log().all();

	}


	@Test
	void shouldDeleteUser(){
		String user = """
				{
				        "username": "BugHunter3000",
				        "firstname": "John",
				        "lastname": "Doe",
				        "about": "Software developer",
				        "phone": 1234567890,
				        "email": "john.doe@example.com",
				        "gender": "MALE",
				        "birthday": "1995-06-15"
				    }
				""";
		given().log()
				.ifValidationFails()
				.when()
				.body(user)
				.contentType("application/json")
				.delete("/api/v1/users")
				.then()
				.statusCode(200);
	}



}
