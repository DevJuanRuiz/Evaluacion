package com.mitocode.dto;

import java.util.List;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Paciente DTO Data")
public class PacienteCortoDTO {

	private Integer idPaciente;	
	
	@Schema(description = "nombres del paciente")
	@NotEmpty
	@Size(min = 3, message = "{nombres.size}")
	private String nombres;	
	
	@Schema(description = "apellidos del paciente")
	@NotNull
	@Size(min = 3, message = "{apellidos.size}")
	private String apellidos;	
	
	@Size(min = 8)
	private String dni;	
	
	@Size(min = 3, max = 150)
	private String direccion;	
	
	@Size(min = 9, max = 9)
	private String telefono;	
	
	@Email
	//@Pattern(regexp="")
	private String email;
		
	public Integer getIdPaciente() {
		return idPaciente;
	}
	public void setIdPaciente(Integer idPaciente) {
		this.idPaciente = idPaciente;
	}
	public String getNombres() {
		return nombres;
	}
	public void setNombres(String nombres) {
		this.nombres = nombres;
	}
	public String getApellidos() {
		return apellidos;
	}
	public void setApellidos(String apellidos) {
		this.apellidos = apellidos;
	}
	public String getDni() {
		return dni;
	}
	public void setDni(String dni) {
		this.dni = dni;
	}
	public String getDireccion() {
		return direccion;
	}
	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}
	public String getTelefono() {
		return telefono;
	}
	public void setTelefono(String telefono) {
		this.telefono = telefono;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	
}
