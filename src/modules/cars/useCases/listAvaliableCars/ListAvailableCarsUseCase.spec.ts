import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";


let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("List cars", () => {

  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(carsRepositoryInMemory);
  })

  it("should be able to list all Available cars", async () => {

    const car = await carsRepositoryInMemory.create({
      brand: "Car",
      category_id: "category_id",
      daily_rate: 120.00,
      description: "Car desciption",
      fine_amount: 80.00,
      license_plate: "IGA-1111",
      name: "CAr1"
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([car])
  });

  it("should be able to list available cars by brand", async () => {
    const car = await carsRepositoryInMemory.create({
      brand: "Car_brand",
      category_id: "category_id",
      daily_rate: 120.00,
      description: "Car desciption",
      fine_amount: 80.00,
      license_plate: "IGA-2222",
      name: "Car2"
    });

    const cars = await listAvailableCarsUseCase.execute({
      brand: "Car_brand"
    });

    expect(cars).toEqual([car])
  });
  
  it("should be able to list available cars by name", async () => {
    const car = await carsRepositoryInMemory.create({
      brand: "Car_brand",
      category_id: "category_id",
      daily_rate: 120.00,
      description: "Car desciption",
      fine_amount: 80.00,
      license_plate: "IGA-3333",
      name: "Car3"
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: "Car3"
    });

    expect(cars).toEqual([car])
  });
  it("should be able to list available cars by name", async () => {
    const car = await carsRepositoryInMemory.create({
      brand: "Car_brand",
      category_id: "category_id_test",
      daily_rate: 120.00,
      description: "Car desciption",
      fine_amount: 80.00,
      license_plate: "IGA-4444",
      name: "Car4"
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: "category_id_test"
    });

    expect(cars).toEqual([car])
  });
})