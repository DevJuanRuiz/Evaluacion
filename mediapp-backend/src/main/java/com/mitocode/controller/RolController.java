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

import com.mitocode.dto.RolDTO;
import com.mitocode.exception.ModeloNotFoundException;
import com.mitocode.model.Rol;
import com.mitocode.service.IRolService;

@RestController
@RequestMapping("/roles")
public class RolController {
	
	@Autowired
	private ModelMapper mapper;
	
	@Autowired
	private IRolService service;
	
	@GetMapping
	public ResponseEntity<List<RolDTO>> listar() throws Exception{
		List<Rol> menus = new ArrayList<>();
		menus = service.listar();
		List<RolDTO> menusDTO = mapper.map(menus, new TypeToken<List<RolDTO>>() {}.getType());
		return new ResponseEntity<>(menusDTO, HttpStatus.OK);
	}
	
	@GetMapping("/{id}")	
	//@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<RolDTO> listarPorId(@PathVariable("id") Integer id) throws Exception{
		RolDTO dtoResponse; 
		Rol obj = service.listarPorId(id);
		if (obj == null) {
			throw new ModeloNotFoundException("ID NO ENCONTRADO" + id);
		}else {
			dtoResponse = mapper.map(obj, RolDTO.class);
		}		
		return new ResponseEntity<>(dtoResponse, HttpStatus.OK);
	}
	
	@PostMapping	
	public ResponseEntity<Void> registrar(@Valid @RequestBody RolDTO dtoRquest) throws Exception{
		Rol p = mapper.map(dtoRquest, Rol.class);
		Rol obj = service.registrar(p);
		RolDTO dtoResponse = mapper.map(obj, RolDTO.class);
		
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(dtoResponse.getIdRol()).toUri();
		
		return ResponseEntity.created(location).build();
	}
	
	@PutMapping	
	public ResponseEntity<RolDTO> modificar(@Valid @RequestBody RolDTO dtoRquest) throws Exception{
		Rol pac = service.listarPorId(dtoRquest.getIdRol());
		if (pac == null) {
			throw new ModeloNotFoundException("ID NO ENCONTRADO" + dtoRquest.getIdRol());
		}
		
		Rol p = mapper.map(dtoRquest, Rol.class);
		Rol obj = service.modificar(p);
		RolDTO dtoResponse = mapper.map(obj, RolDTO.class);		
		return new ResponseEntity<>(dtoResponse, HttpStatus.OK);
	}
	
	@DeleteMapping("/{id}")	
	public ResponseEntity<Void> eliminar(@PathVariable("id") Integer id) throws Exception{
		Rol obj = service.listarPorId(id);
		if (obj == null) {
			throw new ModeloNotFoundException("ID NO ENCONTRADO" + id);
		}
		
		service.eliminar(id);		
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}
	
	@GetMapping("/hateoas/{id}")
	public EntityModel<RolDTO> listarHateoas(@PathVariable("id") Integer id) throws Exception{
		Rol obj = service.listarPorId(id);
		if (obj == null) {
			throw new ModeloNotFoundException("ID NO ENCONTRADO" + id);
		}
		
		RolDTO dto = mapper.map(obj, RolDTO.class);
		
		EntityModel<RolDTO> recurso = EntityModel.of(dto);
		
		//localhost:8094/Rols/1
		WebMvcLinkBuilder link1 = linkTo(methodOn(this.getClass()).listarPorId(id));
		
		recurso.add(link1.withRel("Rol-link"));
		return recurso;
	}
	
	@GetMapping("/pageable")
	public ResponseEntity<Page<RolDTO>> listarPageable(Pageable page) throws Exception{
		Page<RolDTO> Rols = service.listarPageable(page).map(p -> mapper.map(p, RolDTO.class));
		
		return new ResponseEntity<>(Rols, HttpStatus.OK);
	}

}
