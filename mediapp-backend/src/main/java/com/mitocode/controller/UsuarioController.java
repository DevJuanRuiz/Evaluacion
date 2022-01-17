package com.mitocode.controller;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.mitocode.dto.ConsultaDTO;
import com.mitocode.dto.UsuarioDTO;
import com.mitocode.exception.ModeloNotFoundException;
import com.mitocode.model.Consulta;
import com.mitocode.model.Usuario;
import com.mitocode.service.IUsuarioService;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
	
	@Autowired
	private ModelMapper mapper;
	
	@Autowired
	private IUsuarioService service;
	
	@GetMapping
	public ResponseEntity<List<UsuarioDTO>> listar() throws Exception{
		List<Usuario> menus = new ArrayList<>();
		menus = service.listar();
		List<UsuarioDTO> menusDTO = mapper.map(menus, new TypeToken<List<UsuarioDTO>>() {}.getType());
		return new ResponseEntity<>(menusDTO, HttpStatus.OK);
	}
	
	@GetMapping("/{id}")	
	//@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<UsuarioDTO> listarPorId(@PathVariable("id") Integer id) throws Exception{
		UsuarioDTO dtoResponse; 
		Usuario obj = service.listarPorId(id);
		if (obj == null) {
			throw new ModeloNotFoundException("ID NO ENCONTRADO" + id);
		}else {
			dtoResponse = mapper.map(obj, UsuarioDTO.class);
		}		
		return new ResponseEntity<>(dtoResponse, HttpStatus.OK);
	}
	
	@PostMapping	
	public ResponseEntity<Void> registrar(@Valid @RequestBody UsuarioDTO dtoRquest) throws Exception{
		Usuario p = mapper.map(dtoRquest, Usuario.class);
		Usuario obj = service.registrar(p);
		UsuarioDTO dtoResponse = mapper.map(obj, UsuarioDTO.class);
		
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(dtoResponse.getIdUsuario()).toUri();
		
		return ResponseEntity.created(location).build();
	}
	
	@PutMapping	
	public ResponseEntity<UsuarioDTO> modificar(@Valid @RequestBody UsuarioDTO dtoRquest) throws Exception{
		Usuario pac = service.listarPorId(dtoRquest.getIdUsuario());
		if (pac == null) {
			throw new ModeloNotFoundException("ID NO ENCONTRADO" + dtoRquest.getIdUsuario());
		}
		
		Usuario p = mapper.map(dtoRquest, Usuario.class);
		Usuario obj = service.modificar(p);
		UsuarioDTO dtoResponse = mapper.map(obj, UsuarioDTO.class);		
		return new ResponseEntity<>(dtoResponse, HttpStatus.OK);
	}
	
	@PutMapping("/asignarRoles")
	public ResponseEntity<UsuarioDTO> asignarRoles(@Valid @RequestBody UsuarioDTO dtoRequest) throws Exception {
		Usuario pac = service.listarPorId(dtoRequest.getIdUsuario());
		
		
		if(pac == null) {
			throw new ModeloNotFoundException("ID NO ENCONTRADO " + dtoRequest.getIdUsuario());	
		}		
		
		Usuario p = mapper.map(dtoRequest, Usuario.class);			
		Usuario user = pac;
		user.setRoles(p.getRoles());
		Usuario obj = service.modificar(user);		
		UsuarioDTO dtoResponse = mapper.map(obj, UsuarioDTO.class);
		
		return new ResponseEntity<>(dtoResponse, HttpStatus.OK);		
	}
	
	@DeleteMapping("/{id}")	
	public ResponseEntity<Void> eliminar(@PathVariable("id") Integer id) throws Exception{
		Usuario obj = service.listarPorId(id);
		if (obj == null) {
			throw new ModeloNotFoundException("ID NO ENCONTRADO" + id);
		}
		
		service.eliminar(id);		
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}
	
	@GetMapping("/hateoas/{id}")
	public EntityModel<UsuarioDTO> listarHateoas(@PathVariable("id") Integer id) throws Exception{
		Usuario obj = service.listarPorId(id);
		if (obj == null) {
			throw new ModeloNotFoundException("ID NO ENCONTRADO" + id);
		}
		
		UsuarioDTO dto = mapper.map(obj, UsuarioDTO.class);
		
		EntityModel<UsuarioDTO> recurso = EntityModel.of(dto);
		
		//localhost:8094/Usuarios/1
		WebMvcLinkBuilder link1 = linkTo(methodOn(this.getClass()).listarPorId(id));
		
		recurso.add(link1.withRel("Usuario-link"));
		return recurso;
	}
	
	@GetMapping("/pageable")
	public ResponseEntity<Page<UsuarioDTO>> listarPageable(Pageable page) throws Exception{
		Page<UsuarioDTO> Usuarios = service.listarPageable(page).map(p -> mapper.map(p, UsuarioDTO.class));
		
		return new ResponseEntity<>(Usuarios, HttpStatus.OK);
	}

}
