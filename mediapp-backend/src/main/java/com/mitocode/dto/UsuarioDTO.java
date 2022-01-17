package com.mitocode.dto;

import java.util.List;

import javax.validation.constraints.NotNull;

public class UsuarioDTO {

	
	private Integer idUsuario;
	@NotNull
	private String username;
	@NotNull
	private boolean enabled;
	
	private List<RolDTO> roles;

	public Integer getIdUsuario() {
		return idUsuario;
	}

	public void setIdUsuario(Integer idUsuario) {
		this.idUsuario = idUsuario;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public boolean isEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public List<RolDTO> getRoles() {
		return roles;
	}

	public void setRoles(List<RolDTO> roles) {
		this.roles = roles;
	}

	

}
