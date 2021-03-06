import { SpecificationsRepository } from "@modules/cars/infra/typeorm/repositories/SpecificationsRepository";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory"
import { SpecificationRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationRepositoryInMemory";
import { AppError } from "@shared/errors/AppError"
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase"


let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationRepositoryInMemory;

describe("Create Car Specification", () => {

  beforeEach(() => {
    specificationsRepositoryInMemory = new SpecificationRepositoryInMemory()
    carsRepositoryInMemory = new CarsRepositoryInMemory()
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(carsRepositoryInMemory, specificationsRepositoryInMemory); 
  })

  it("should be able to add a new specification to a non-existent car ", async () => {
    const car_id = "123";
    const specifications_id = ["5432"];

    await expect(createCarSpecificationUseCase.execute({
            car_id,
            specifications_id
          })).rejects.toEqual(new AppError("Car does not exists"))
  });
  
  it("should be able to add a new specification to the car", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "test",
      description: "Description Test",
      daily_rate: 400,
      license_plate: "license",
      fine_amount: 80,
      brand: "Brand",
      category_id: "category",
   });

   const specification = await specificationsRepositoryInMemory.create({
     description: "Test",
     name: "test"
   })

    const specifications_id = [specification.id];

    const specificationsCars = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id
    });

    expect(specificationsCars).toHaveProperty("specifications");
    expect(specificationsCars.specifications.length).toBe(1);
  });
})