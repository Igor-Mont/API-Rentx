import dayjs from "dayjs";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { CreateRentalUseCase } from "./CreateRentalUseCase"
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayJsDateProvider: DayjsDateProvider

describe("Create a Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();
  beforeEach(() => {
    dayJsDateProvider = new DayjsDateProvider();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory, dayJsDateProvider, carsRepositoryInMemory);
  });


  it("should be able to create a new rental", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Test",
      brand: "test",
      category_id: "category",
      daily_rate: 100,
      description:"description test",
      license_plate: "12312",
      fine_amount: 20
    })

    const rental = await createRentalUseCase.execute({
      car_id: car.id,
      user_id: "12345",
      expected_return_date: dayAdd24Hours
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });
  
  it("should not be able to create a new rental if there is another open to the same user", async () => {
    await rentalsRepositoryInMemory.create({
      car_id: "12331",
      expected_return_date: dayAdd24Hours,
      user_id: "11111"
    });

    await expect(createRentalUseCase.execute({
            car_id: "12345",
            user_id: "11111",
            expected_return_date: dayAdd24Hours
          })).rejects.toEqual(new AppError("There's a rental in progress for user!"));
  });

  it("should not be able to create a new rental if there is another open to the same car", async () => {
    await rentalsRepositoryInMemory.create({
      car_id: "test",
      expected_return_date: dayAdd24Hours,
      user_id: "11111"
    });

    await expect(createRentalUseCase.execute({
            car_id: "test",
            user_id: "11111",
            expected_return_date: dayAdd24Hours
          })).rejects.toEqual(new AppError("Car is unavailable"));
  });
  
  it("should not be able to create a new rental with invalid return time", async () => {
    await expect(createRentalUseCase.execute({
            car_id: "test",
            user_id: "2222",
            expected_return_date: dayjs().toDate()
          })).rejects.toEqual(new AppError("Invalid return time"));
  });

})