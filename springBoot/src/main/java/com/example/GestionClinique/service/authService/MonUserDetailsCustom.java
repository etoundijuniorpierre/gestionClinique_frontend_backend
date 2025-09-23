package com.example.GestionClinique.service.authService;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import java.util.Collection;

@Getter
public class MonUserDetailsCustom extends User {

    private final Long id;
    private final String photoProfilPath;

    public MonUserDetailsCustom(Long id, String username, String password, String photoProfilPath,
                                Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
        this.id = id;
        this.photoProfilPath = photoProfilPath;
    }

    public MonUserDetailsCustom(Long id, String username, String password, String photoProfilPath,
                                boolean enabled, boolean accountNonExpired,
                                boolean credentialsNonExpired, boolean accountNonLocked,
                                Collection<? extends GrantedAuthority> authorities) {
        super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
        this.id = id;
        this.photoProfilPath = photoProfilPath;
    }
}