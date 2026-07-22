import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  create(dto: CreateCategoryDto) {
    const category = this.categoryRepository.create(dto);
    return this.categoryRepository.save(category);
  }

  findAll() {
    return this.categoryRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException(`Categoria ${id} não encontrada`);
    return category;
  }

  async update(id: string, dto: CreateCategoryDto) {
    const category = await this.findOne(id);
    Object.assign(category, dto);
    return this.categoryRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}
