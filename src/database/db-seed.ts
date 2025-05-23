import { AppDataSource } from '../database/data-source';
import { Store } from '../store/entities/store.entity';

const stores = [
  {
    name: 'Lyvretto Recife',
    street: 'Rua José de Alencar',
    district: 'Boa Vista',
    city: 'Recife',
    state: 'Pernambuco',
    postalCode: '50070-075',
    latitude: -8.06299,
    longitude: -34.89012,
    type: 'PDV',
    emailAddress: 'pelivrettorecife@gmail.com',
    phoneNumber: '(81) 98845-7189',
    takeOutInStore: true,
    shippingTimeInDays: 3,
  },
  {
    name: 'Lyvretto Caruaru',
    street: 'Avenida Rio Branco',
    district: 'Nossa Senhora das Dores',
    city: 'Caruaru',
    state: 'Pernambuco',
    postalCode: '55002-506',
    latitude: -8.2843,
    longitude: -35.9707,
    type: 'PDV',
    emailAddress: 'pelivrettocaruaru@gmail.com',
    phoneNumber: '(81) 99044-7190',
    takeOutInStore: true,
    shippingTimeInDays: 5,
  },
  {
    name: 'Lyvretto Petrolina',
    street: 'Rua do Imperador',
    district: 'Centro',
    city: 'Petrolina',
    state: 'Pernambuco',
    postalCode: '56306-780',
    latitude: -9.3864,
    longitude: -40.5074,
    type: 'PDV',
    emailAddress: 'pelivrettopetrolina@gmail.com',
    phoneNumber: '(87) 98845-7191',
    takeOutInStore: true,
    shippingTimeInDays: 6,
  },
  {
    name: 'Lyvretto João Pessoa',
    street: 'Avenida Pres. Epitácio Pessoa',
    district: 'Tambaú',
    city: 'João Pessoa',
    state: 'Paraíba',
    postalCode: '58039-000',
    latitude: -7.1191,
    longitude: -34.8267,
    type: 'PDV',
    emailAddress: 'pblivrettojoaopessoa@gmail.com',
    phoneNumber: '(83) 98845-7192',
    takeOutInStore: true,
    shippingTimeInDays: 9,
  },
  {
    name: 'Lyvretto Campina Grande',
    street: 'Rua Ulisses Gomes',
    district: 'Centro',
    city: 'Campina Grande',
    state: 'Paraíba',
    postalCode: '58400-210',
    latitude: -7.2213,
    longitude: -35.8765,
    type: 'PDV',
    emailAddress: 'pblivrettocampinagrande@gmail.com',
    phoneNumber: '(83) 91145-7193',
    takeOutInStore: true,
    shippingTimeInDays: 12,
  },
  {
    name: 'Lyvretto Maceió',
    street: 'Avenida Doutor Antônio Gouveia',
    district: 'Pajuçara',
    city: 'Maceió',
    state: 'Alagoas',
    postalCode: '57030-170',
    latitude: -9.6658,
    longitude: -35.735,
    type: 'PDV',
    emailAddress: 'allivrettomaceio@gmail.com',
    phoneNumber: '(82) 98845-7194',
    takeOutInStore: true,
    shippingTimeInDays: 20,
  },
  {
    name: 'Lyvretto Arapiraca',
    street: 'Rua Quinze de Novembro',
    district: 'Centro',
    city: 'Arapiraca',
    state: 'Alagoas',
    postalCode: '57301-175',
    latitude: -9.7519,
    longitude: -36.6585,
    type: 'PDV',
    emailAddress: 'allivrettoarapiraca@gmail.com',
    phoneNumber: '(82) 98845-7195',
    takeOutInStore: true,
    shippingTimeInDays: 22,
  },
];

export async function seed() {
    
  console.log("Inicializando banco...");
  await AppDataSource.initialize();

  const storeRepository = AppDataSource.getRepository(Store);

  console.log("Limpando dados anteriores...");
  await storeRepository.clear();

  console.log("Criando dados...");
  const storeEntities = stores.map((s) => storeRepository.create(s));

  console.log("Salvando dados...");
  await storeRepository.save(storeEntities);
}

seed()
  .then(() => {
    console.log('Banco de dados populado com sucesso!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Erro ao rodar seed. Banco de dados não foi populado:', err);
    process.exit(1);
  });