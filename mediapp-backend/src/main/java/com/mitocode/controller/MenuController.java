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

import com.mitocode.dto.MenuDTO;
import com.mitocode.exception.ModeloNotFoundException;
import com.mitocode.model.Menu;
import com.mitocode.service.IMenuService;

@RestController
@RequestMapping("/menus")
public class MenuController {
	
	@Autowired
	private ModelMapper mapper;
	
	@Autowired
	private IMenuService service;
	
	@GetMapping
	public ResponseEntity<List<MenuDTO>> listar() throws Exception{
		List<Menu> menus = new ArrayList<>();
		menus = service.listar();
		List<MenuDTO> menusDTO = mapper.map(menus, new TypeToken<List<MenuDTO>>() {}.getType());
		return new ResponseEntity<>(menusDTO, HttpStatus.OK);
	}
	
	@PostMapping("/usuario")
	public ResponseEntity<List<MenuDTO>> listar(@RequestBody String nombre) throws Exception{
		List<Menu> menus = new ArrayList<>();
		//Authentication usuarioLogueado = SecurityContextHolder.getContext().getAuthentication();
		//menus = service.listarMenuPorUsuario(usuarioLogueado.getName());
		menus = service.listarMenuPorUsuario(nombre);
		List<MenuDTO> menusDTO = mapper.map(menus, new TypeToken<List<MenuDTO>>() {}.getType());
		return new ResponseEntity<>(menusDTO, HttpStatus.OK);
	}
	
	@GetMapping("/{id}")	
	//@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<MenuDTO> listarPorId(@PathVariable("id") Integer id) throws Exception{
		MenuDTO dtoResponse; 
		Menu obj = service.listarPorId(id);
		if (obj == null) {
			throw new ModeloNotFoundException("ID NO ENCONTRADO" + id);
		}else {
			dtoResponse = mapper.map(obj, MenuDTO.class);
		}		
		return new ResponseEntity<>(dtoResponse, HttpStatus.OK);
	}
	
	@PostMapping	
	public ResponseEntity<Void> registrar(@Valid @RequestBody MenuDTO dtoRquest) throws Exception{
		Menu p = mapper.map(dtoRquest, Menu.class);
		Menu obj = service.registrar(p);
		MenuDTO dtoResponse = mapper.map(obj, MenuDTO.class);
		
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(dtoResponse.getIdMenu()).toUri();
		
		return ResponseEntity.created(location).build();
	}
	
	@PutMapping	
	public ResponseEntity<MenuDTO> modificar(@Valid @RequestBody MenuDTO dtoRquest) throws Exception{
		Menu pac = service.listarPorId(dtoRquest.getIdMenu());
		if (pac == null) {
			throw new ModeloNotFoundException("ID NO ENCONTRADO" + dtoRquest.getIdMenu());
		}
		
		Menu p = mapper.map(dtoRquest, Menu.class);
		Menu obj = service.modificar(p);
		MenuDTO dtoResponse = mapper.map(obj, MenuDTO.class);		
		return new ResponseEntity<>(dtoResponse, HttpStatus.OK);
	}
	
	@PutMapping("/asignarRoles")
	public ResponseEntity<MenuDTO> asignarRoles(@Valid @RequestBody MenuDTO dtoRequest) throws Exception {
		Menu pac = service.listarPorId(dtoRequest.getIdMenu());
		
		
		if(pac == null) {
			throw new ModeloNotFoundException("ID NO ENCONTRADO " + dtoRequest.getIdMenu());	
		}		
		
		Menu p = mapper.map(dtoRequest, Menu.class);			
		Menu user = pac;
		user.setRoles(p.getRoles());
		Menu obj = service.modificar(user);		
		MenuDTO dtoResponse = mapper.map(obj, MenuDTO.class);
		
		return new ResponseEntity<>(dtoResponse, HttpStatus.OK);		
	}
	
	@DeleteMapping("/{id}")	
	public ResponseEntity<Void> eliminar(@PathVariable("id") Integer id) throws Exception{
		Menu obj = service.listarPorId(id);
		if (obj == null) {
			throw new ModeloNotFoundException("ID NO ENCONTRADO" + id);
		}
		
		service.eliminar(id);		
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}
	
	@GetMapping("/hateoas/{id}")
	public EntityModel<MenuDTO> listarHateoas(@PathVariable("id") Integer id) throws Exception{
		Menu obj = service.listarPorId(id);
		if (obj == null) {
			throw new ModeloNotFoundException("ID NO ENCONTRADO" + id);
		}
		
		MenuDTO dto = mapper.map(obj, MenuDTO.class);
		
		EntityModel<MenuDTO> recurso = EntityModel.of(dto);
		
		//localhost:8094/Menus/1
		WebMvcLinkBuilder link1 = linkTo(methodOn(this.getClass()).listarPorId(id));
		
		recurso.add(link1.withRel("Menu-link"));
		return recurso;
	}
	
	@GetMapping("/pageable")
	public ResponseEntity<Page<MenuDTO>> listarPageable(Pageable page) throws Exception{
		Page<MenuDTO> Menus = service.listarPageable(page).map(p -> mapper.map(p, MenuDTO.class));
		
		return new ResponseEntity<>(Menus, HttpStatus.OK);
	}

}
