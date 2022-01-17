package com.mitocode.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.mitocode.model.Rol;

public interface IRolService extends ICRUD<Rol, Integer> {

	Page<Rol> listarPageable(Pageable page);	

}
