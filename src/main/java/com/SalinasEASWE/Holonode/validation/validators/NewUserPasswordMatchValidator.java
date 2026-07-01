package com.SalinasEASWE.Holonode.validation.validators;

import com.SalinasEASWE.Holonode.dto.UserRegistrationDto;
import com.SalinasEASWE.Holonode.validation.annotations.NewUserPasswordMatch;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

// Validator for the NewUserPasswordMatch annotation. Returns true if the password and confirmPassword fields match/is not null and false otherwise
public class NewUserPasswordMatchValidator implements ConstraintValidator<NewUserPasswordMatch, UserRegistrationDto> {

    @Override
    public boolean isValid(UserRegistrationDto value, ConstraintValidatorContext context) {
        if (value.getPassword() == null || value.getConfirmPassword() == null) {
            return false;
        }
        else {
            return value.getPassword().equals(value.getConfirmPassword());
        }
    }
}
