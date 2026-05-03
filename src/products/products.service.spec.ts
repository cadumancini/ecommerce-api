import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create a new product', () => {
    const createProductDto: CreateProductDto = {
      name: 'Coffee',
      description: 'Dark Roast',
      price: 9.99,
      stock: 100,
      category: 'Beverages',
    };
    const product = service.create(createProductDto);
    expect(product).toBeDefined();
    expect(product.id).toBeDefined();
    expect(product).toMatchObject(createProductDto);
    expect(product.createdAt.getTime()).toBeLessThanOrEqual(Date.now());
    expect(product.updatedAt).toEqual(product.createdAt);
    expect(service.findById(product.id)).toEqual(product);
  });

  it('should return all products', () => {
    const dto1: CreateProductDto = {
      name: 'Coffee',
      description: 'Dark Roast',
      price: 9.99,
      stock: 100,
      category: 'Beverages',
    };
    const dto2: CreateProductDto = {
      name: 'Tea',
      description: 'Green Tea',
      price: 4.99,
      stock: 50,
      category: 'Beverages',
    };
    const product1 = service.create(dto1);
    const product2 = service.create(dto2);
    const products = service.findAll();
    expect(products).toContainEqual(product1);
    expect(products).toContainEqual(product2);
    expect(products).toHaveLength(2);
  });

  it('should return an empty array when there are no products', () => {
    const products = service.findAll();
    expect(products).toEqual([]);
  });

  it('should return the product when id exists', () => {
    const dto: CreateProductDto = {
      name: 'Coffee',
      description: 'Dark Roast',
      price: 9.99,
      stock: 100,
      category: 'Beverages',
    };
    const product = service.create(dto);
    const found = service.findById(product.id);
    expect(found).toEqual(product);
  });

  it('should throw NotFoundException when id does not exist', () => {
    expect(() => service.findById('invalid-id')).toThrow(
      new NotFoundException('Product with id invalid-id not found'),
    );
  });

  it('should update the product when id exists', () => {
    const createDto: CreateProductDto = {
      name: 'Coffee',
      description: 'Dark Roast',
      price: 9.99,
      stock: 100,
      category: 'Beverages',
    };
    const product = service.create(createDto);
    const updateDto: UpdateProductDto = {
      price: 12.99,
    };
    const updatedProduct = service.update(product.id, updateDto);
    expect(service.findById(product.id)).toEqual(updatedProduct);
    expect(updatedProduct).toMatchObject({
      id: product.id,
      name: product.name,
      description: product.description,
      price: 12.99,
      stock: product.stock,
      category: product.category,
    });
    expect(updatedProduct.updatedAt.getTime()).toBeGreaterThanOrEqual(
      product.createdAt.getTime(),
    );
    expect(updatedProduct.createdAt).toEqual(product.createdAt);
  });

  it('should update the product and check updatedAt using fake timers', () => {
    const T0 = new Date('2026-01-01T00:00:00Z');
    const T1 = new Date('2026-01-02T00:00:00Z');
    jest.useFakeTimers().setSystemTime(T0);
    const createDto: CreateProductDto = {
      name: 'Milk',
      description: 'Fresh and Creamy',
      price: 6.99,
      stock: 80,
      category: 'Beverages',
    };
    const product = service.create(createDto);
    jest.setSystemTime(T1);
    const updateDto: UpdateProductDto = {
      price: 8.99,
    };
    const updatedProduct = service.update(product.id, updateDto);
    expect(updatedProduct.createdAt).toEqual(T0);
    expect(updatedProduct.updatedAt).toEqual(T1);
    expect(updatedProduct).toMatchObject({
      id: product.id,
      name: product.name,
      description: product.description,
      price: 8.99,
      stock: product.stock,
      category: product.category,
    });
  });

  it('should throw NotFoundException when updating an unknown id', () => {
    expect(() => service.update('invalid-id', { price: 10.99 })).toThrow(
      new NotFoundException('Product with id invalid-id not found'),
    );
  });

  it('should delete the product when id exists', () => {
    const dto: CreateProductDto = {
      name: 'Coffee',
      description: 'Dark Roast',
      price: 9.99,
      stock: 100,
      category: 'Beverages',
    };
    const product = service.create(dto);
    service.remove(product.id);
    expect(() => service.findById(product.id)).toThrow(
      new NotFoundException(`Product with id ${product.id} not found`),
    );
  });

  it('should throw NotFoundException when trying to delete a non-existent product', () => {
    expect(() => service.remove('invalid-id')).toThrow(
      new NotFoundException('Product with id invalid-id not found'),
    );
  });
});
