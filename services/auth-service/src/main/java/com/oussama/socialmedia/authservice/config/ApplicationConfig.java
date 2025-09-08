package com.oussama.socialmedia.authservice.config;


import com.oussama.socialmedia.authservice.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@AllArgsConstructor
public class ApplicationConfig {
    private final UserRepository userRepository;

    /**
     * Defines a BCryptPasswordEncoder bean.
     * This is used to securely hash and verify passwords.
     */
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }



    /**
     * This tells Spring Security how to fetch user details
     * from the database using the UserRepository.
     * @return UserDetailsService implementation based on username
     * @throws UsernameNotFoundException if the user does not exist
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByUsername(username).orElseThrow(()->new UsernameNotFoundException("User not found"));
    }


    /**
     * The AuthenticationManager is responsible for handling
     * authentication requests in Spring Security.
     *
     * @param authenticationConfiguration provided by Spring Security
     * @return AuthenticationManager
     * @throws Exception if the manager cannot be created
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }


    /**
     * This sets up a DaoAuthenticationProvider that uses:
     * - The UserDetailsService to load users
     * - The BCryptPasswordEncoder to verify passwords
     *
     * @return configured AuthenticationProvider
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(bCryptPasswordEncoder());
        return authProvider;
    }


}