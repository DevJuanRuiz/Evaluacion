package com.mitocode.dto;

import java.time.LocalDateTime;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import io.swagger.v3.oas.annotations.media.Schema;

public class PacienteSignoVitalDTO {

	private Integer idSignoVital;
	@NotNull
	private PacienteCortoDTO paciente;
	@NotNull
	private LocalDateTime fecha;//Spring boot 1.5 -> pm.xml jsr310
	@NotNull
	private String temperatura;
	@NotNull
	private String pulso;
	@NotNull
	private String ritmo;
	public Integer getIdSignoVital() {
		return idSignoVital;
	}
	public void setIdSignoVital(Integer idSignoVital) {
		this.idSignoVital = idSignoVital;
	}	
	public PacienteCortoDTO getPaciente() {
		return paciente;
	}
	public void setPaciente(PacienteCortoDTO paciente) {
		this.paciente = paciente;
	}
	public LocalDateTime getFecha() {
		return fecha;
	}
	public void setFecha(LocalDateTime fecha) {
		this.fecha = fecha;
	}
	public String getTemperatura() {
		return temperatura;
	}
	public void setTemperatura(String temperatura) {
		this.temperatura = temperatura;
	}	
	public String getPulso() {
		return pulso;
	}
	public void setPulso(String pulso) {
		this.pulso = pulso;
	}
	public String getRitmo() {
		return ritmo;
	}
	public void setRitmo(String ritmo) {
		this.ritmo = ritmo;
	}
	
	
}
