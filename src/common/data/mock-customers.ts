import { Customer, CustomerType, Gender, MaritalStatus } from '../../pages/Accountant/Customers/types';

export const mockCustomers: Customer[] = [
  {
    id: 1,
    isCompany: true,
    title: "شرکت فناوری اطلاعات نوین",
    firstName: "",
    lastName: "",
    nationalId: "1012345678",
    taxId: "1234567890",
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.SINGLE,
    customerType: CustomerType.BUYER,
    customerRiskLimit: 1000000,
    phones: ["021-12345678"],
    email: "info@novintech.ir",
    website: "www.novintech.ir",
    addresses: [{
      title: "دفتر مرکزی",
      value: "تهران، خیابان ولیعصر، پلاک 123",
      postalCode: "1234567890",
      isPrimary: true
    }],
    bankAccounts: []
  },
  {
    id: 2,
    isCompany: false,
    title: "",
    firstName: "علی",
    lastName: "محمدی",
    nationalId: "0123456789",
    taxId: "9876543210",
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.SINGLE,
    customerType: CustomerType.SELLER,
    customerRiskLimit: 500000,
    phones: ["09123456789"],
    email: "ali.mohammadi@email.com",
    addresses: [{
      title: "منزل",
      value: "تهران، خیابان شریعتی، پلاک 456",
      postalCode: "9876543210",
      isPrimary: true
    }],
    bankAccounts: []
  },
  {
    id: 3,
    isCompany: true,
    title: "شرکت تجهیزات پزشکی سلامت",
    firstName: "",
    lastName: "",
    nationalId: "2012345678",
    taxId: "2345678901",
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.SINGLE,
    customerType: CustomerType.BOTH,
    customerRiskLimit: 2000000,
    phones: ["021-23456789", "09123456788"],
    email: "info@healthmed.ir",
    website: "www.healthmed.ir",
    addresses: [{
      title: "دفتر مرکزی",
      value: "تهران، خیابان پاسداران، پلاک 789",
      postalCode: "2345678901",
      isPrimary: true
    }],
    bankAccounts: []
  },
  {
    id: 4,
    isCompany: false,
    title: "",
    firstName: "رضا",
    lastName: "کریمی",
    nationalId: "0123456780",
    taxId: "9876543211",
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.SINGLE,
    customerType: CustomerType.BUYER,
    customerRiskLimit: 300000,
    phones: ["09123456787"],
    email: "reza.karimi@email.com",
    addresses: [{
      title: "منزل",
      value: "تهران، خیابان ولیعصر، پلاک 321",
      postalCode: "1234567891",
      isPrimary: true
    }],
    bankAccounts: []
  },
  {
    id: 5,
    isCompany: true,
    title: "شرکت صنایع غذایی سلامت",
    firstName: "",
    lastName: "",
    nationalId: "3012345678",
    taxId: "3456789012",
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.SINGLE,
    customerType: CustomerType.BOTH,
    customerRiskLimit: 1500000,
    phones: ["021-34567890", "09123456786"],
    email: "info@healthfood.ir",
    website: "www.healthfood.ir",
    addresses: [{
      title: "دفتر مرکزی",
      value: "تهران، خیابان پاسداران، پلاک 567",
      postalCode: "3456789012",
      isPrimary: true
    }],
    bankAccounts: []
  }
]; 