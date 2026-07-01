package com.SalinasEASWE.Holonode.validation.annotations;

import com.SalinasEASWE.Holonode.validation.validators.NewUserPasswordMatchValidator;
import jakarta.validation.Constraint;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

// Custom annotation for validating that the password and confirmPassword fields match in the UserRegistrationDto
@Constraint(validatedBy = NewUserPasswordMatchValidator.class)
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface NewUserPasswordMatch {
    String message() default "Passwords do not match. Please try again.";
    Class<?>[] groups() default {};
    Class<? extends jakarta.validation.Payload>[] payload() default {};
}
