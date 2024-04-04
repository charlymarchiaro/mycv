import {Injectable, NotFoundException} from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Report} from "./report.entity";
import {CreateReportDto} from "./dtos/create-report-dto";
import {User} from "../users/user.entity";
import {GetEstimateDto} from "./dtos/get-estimate.dto";

@Injectable()
export class ReportsService {

  constructor(@InjectRepository(Report) private repo: Repository<Report>) {
  }

  createEstimate({make, model, lat, lng, year, mileage}: GetEstimateDto) {
    return this.repo.createQueryBuilder()
       .select('*')
       .where('approved IS TRUE')
       .andWhere('make = :make', {make})
       .andWhere('model = :model', {model})
       .andWhere('lat - :lat BETWEEN -5 AND 5', {lat})
       .andWhere('lng - :lng BETWEEN -5 AND 5', {lng})
       .andWhere('year - :year BETWEEN -3 AND 3', {year})
       .orderBy('ABS(mileage - :mileage)', 'ASC')
       .setParameters({mileage})
       .getRawMany()
  }

  create(createReportDto: CreateReportDto, user: User) {
    const report = this.repo.create(createReportDto);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({id: parseInt(id)})
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    report.approved = approved;
    return this.repo.save(report);
  }
}
