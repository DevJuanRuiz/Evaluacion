package com.mitocode.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.mitocode.model.SignoVital;
import com.mitocode.repo.IGenericRepo;
import com.mitocode.repo.ISignoVitalRepo;
import com.mitocode.service.ISignoVitalService;

@Service
public class SignoVitalServiceImpl extends CRUDImpl<SignoVital, Integer> implements ISignoVitalService{

	@Autowired
	private ISignoVitalRepo repo;

	@Override
	protected IGenericRepo<SignoVital, Integer> getRepo() {
		// TODO Auto-generated method stub
		return repo;
	}
	
	
	@Override
	public Page<SignoVital> listarSignosVitales (Pageable page){
		return repo.findAll(page);
	}

}
