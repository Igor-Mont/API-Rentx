import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';
import { CreateCarUseCase } from './CreateCarUseCase';

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create cars", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  })

  it("should be able to create a new car", async () => {
    const car = await createCarUseCase.execute({
      name: "test",
      description: "Description Test",
      daily_rate: 400,
      license_plate: "license",
      fine_amount: 80,
      brand: "Brand",
      category_id: "category",
    });

    expect(car).toHaveProperty("id");
  });

  it("should not be able to create a car with exists license plate", async () => {
    await createCarUseCase.execute({
      name: "car1",
      description: "Description Test",
      daily_rate: 400,
      license_plate: "ABC-1234",
      fine_amount: 80,
      brand: "Brand",
      category_id: "category",
    });

    await expect(createCarUseCase.execute({
        name: "car2",
        description: "Description Test",
        daily_rate: 400,
        license_plate: "ABC-1234",
        fine_amount: 80,
        brand: "Brand",
        category_id: "category",
      })).rejects.toEqual(new AppError("Car Already Exists"))
  });
  
  it("should not be able to create a car with available true by default", async () => {
      const car = await createCarUseCase.execute({
        name: "CAr available",
        description: "Description Test",
        daily_rate: 400,
        license_plate: "ABD-1234",
        fine_amount: 80,
        brand: "Brand",
        category_id: "category",
      });

      expect(car.available).toBe(true);
  });
})