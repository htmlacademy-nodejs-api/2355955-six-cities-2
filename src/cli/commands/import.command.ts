import { ConsoleOutput, getMongoURI } from '../../shared/helpers/index.js';
import { createOffer, ParsedOffer } from '../../shared/helpers/offer.js';
import { DatabaseClient } from '../../shared/libs/database-client/database-client.interface.js';
import { MongoDatabaseClient } from '../../shared/libs/database-client/mongo.database-client.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { Logger } from '../../shared/libs/logger/logger.interface.js';
import { PinoLogger } from '../../shared/libs/logger/pino.logger.js';
import { CommentService } from '../../shared/modules/comment/comment-service.interface.js';
import { CommentModel } from '../../shared/modules/comment/comment.entity.js';
import { DefaultCommentService } from '../../shared/modules/comment/default-comment.service.js';
import { DefaultOfferService } from '../../shared/modules/offer/default-offer.service.js';
import { CreateOfferDto } from '../../shared/modules/offer/dto/create-offer.dto.js';
import { OfferService } from '../../shared/modules/offer/offer-service.interface.js';
import { OfferModel } from '../../shared/modules/offer/offer.entity.js';
import { DefaultUserService } from '../../shared/modules/user/default-user.service.js';
import { UserService } from '../../shared/modules/user/user-service.interface.js';
import { UserModel } from '../../shared/modules/user/user.entity.js';
import { OfferTypeEnum } from '../../shared/types/index.js';
import { DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD } from './command.constant.js';
import { Command } from './command.interface.js';


export class ImportCommand implements Command {
  private userService: UserService;
  private offerService: OfferService;
  private commentService: CommentService;
  private databaseClient: DatabaseClient;
  private logger: Logger;
  private salt: string;
  getName(): string {
    return '--import';
  }


  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);
    this.logger = new PinoLogger();
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.commentService = new DefaultCommentService(this.logger, CommentModel);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  private async saveOffer(offer: ParsedOffer) {
    const {
      title = '',
      description = '',
      createdDate = new Date(),
      previewImage = '',
      images = [],
      type = OfferTypeEnum.Buy,
      price = 0,
      city,
      isPremium = false,
      isFavorite = false,
      roomsCount = 1,
      commentsCount = 0,
      visitorsCount = 0,
      coordinates,
      amenities = [],
      housingType,
      rating = 0,
      user,
      comments = []
    } = offer || {};

    this.logger.info(`Creating user with account: ${user.account}, email: ${user.email}`);
    const createdUser = await this.userService.create({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarPath: user.avatarPath || '',
      account:user.account,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);


    const offerDto: CreateOfferDto = {
      title,
      description,
      createdDate,
      previewImage,
      images,
      type,
      price,
      city,
      isPremium,
      isFavorite,
      roomsCount,
      commentsCount,
      visitorsCount,
      coordinates,
      amenities,
      housingType,
      rating,
      userId: createdUser.id
    };
    const newOffer = await this.offerService.create(offerDto);
    this.logger.info(`Offer created: ${newOffer.id}`);

    for (const commentData of comments) {
      const commentUser = await this.userService.create({
        email: commentData.user.email,
        firstName: commentData.user.firstName,
        lastName: commentData.user.lastName,
        avatarPath: commentData.user.avatarPath || '',
        account:commentData.user.account,
        password: DEFAULT_USER_PASSWORD
      }, this.salt);

      await this.commentService.create({
        comment: commentData.comment,
        rating: commentData.rating,
        userId: commentUser.id,
        offerId: newOffer.id
      });

      this.logger.info(`Comment created for offer: ${newOffer.id}`);
    }
  }

  private async onImportedLine(line: string, reslove: () => void) {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    ConsoleOutput.data('Импортированное предложение', offer);
    reslove();
  }

  private onCompleteImport(count: number) {
    this.databaseClient.disconnect();
    this.logger.info('Database disconnected');
    ConsoleOutput.success(`Импортировано ${ConsoleOutput.highlightNumber(count)} строк данных`);
  }

  async execute(fileName: string, login: string, password: string, host: string, dbname: string, salt: string) {
    const fileReader = new TSVFileReader(fileName.trim());
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;
    const isConnected = await this.databaseClient.connect(uri);
    if (isConnected) {

      this.logger.info('Database connected');
      ConsoleOutput.section('ИМПОРТ ДАННЫХ');
      ConsoleOutput.info(`Начинаю импорт данных из файла ${ConsoleOutput.highlightFile(fileName.trim())}`);

      fileReader.on('line', this.onImportedLine);
      fileReader.on('end', this.onCompleteImport);

      try {
        ConsoleOutput.progress('Читаю файл...');
        await fileReader.read();
      } catch (error) {
        ConsoleOutput.error(error instanceof Error ? error.message : String(error));
        ConsoleOutput.error(`Не удалось прочитать файл: ${ConsoleOutput.highlightFile(fileName)}`);
      }
    } else {
      ConsoleOutput.error('Ошибка подключения к базе данных');
    }
  }

}
