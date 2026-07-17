import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Pública — o site usa pra montar o menu de categorias
 @Get()
findAll() {
  return this.categoriesService.findAll();
}

@Get(':id')
findOne(@Param('id') id: string) {
  return this.categoriesService.findOne(id);
}

@UseGuards(JwtAuthGuard)
@Post()
create(@Body() dto: CreateCategoryDto) {
  return this.categoriesService.create(dto);
}

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: CreateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
