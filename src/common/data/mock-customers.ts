import { Customer, CustomerType } from '../../pages/Accountant/Customers/types';

export const mockCustomers: Customer[] = [
  {
    id: "1",
    basicInfo: {
      isFirm: true,
      companyName: "شرکت فناوری اطلاعات نوین",
      nationalCode: "1012345678",
      taxId: "1234567890",
      customerType: CustomerType.BUYER
    },
    contactInfo: {
      addresses: [{
        address: "تهران، خیابان ولیعصر، پلاک 123",
        postalCode: "1234567890",
        city: "تهران"
      }],
      phones: ["021-12345678"],
      email: "info@novintech.ir",
      website: "www.novintech.ir"
    },
    additionalDetails: {
      notes: "شرکت نرم‌افزاری",
      preferredContactMethod: "email",
      tags: ["IT", "نرم‌افزار"]
    }
  },
  {
    id: "2",
    basicInfo: {
      isFirm: false,
      firstName: "علی",
      lastName: "محمدی",
      nationalCode: "0123456789",
      taxId: "9876543210",
      customerType: CustomerType.SELLER
    },
    contactInfo: {
      addresses: [{
        address: "تهران، خیابان شریعتی، پلاک 456",
        postalCode: "9876543210",
        city: "تهران"
      }],
      phones: ["09123456789"],
      email: "ali.mohammadi@email.com"
    },
    additionalDetails: {
      notes: "فروشنده لوازم الکترونیکی",
      preferredContactMethod: "phone"
    }
  },
  {
    id: "3",
    basicInfo: {
      isFirm: true,
      companyName: "شرکت تجهیزات پزشکی سلامت",
      nationalCode: "2012345678",
      taxId: "2345678901",
      customerType: CustomerType.BOTH
    },
    contactInfo: {
      addresses: [{
        address: "تهران، خیابان پاسداران، پلاک 789",
        postalCode: "2345678901",
        city: "تهران"
      }],
      phones: ["021-23456789", "09123456788"],
      email: "info@healthmed.ir",
      website: "www.healthmed.ir"
    },
    additionalDetails: {
      notes: "توزیع‌کننده تجهیزات پزشکی",
      preferredContactMethod: "email",
      tags: ["پزشکی", "تجهیزات"]
    }
  },
  {
    id: "4",
    basicInfo: {
      isFirm: false,
      firstName: "رضا",
      lastName: "کریمی",
      nationalCode: "0123456780",
      taxId: "9876543211",
      customerType: CustomerType.BUYER
    },
    contactInfo: {
      addresses: [{
        address: "تهران، خیابان ولیعصر، پلاک 321",
        postalCode: "1234567891",
        city: "تهران"
      }],
      phones: ["09123456787"],
      email: "reza.karimi@email.com"
    },
    additionalDetails: {
      notes: "خریدار لوازم خانگی",
      preferredContactMethod: "phone"
    }
  },
  {
    id: "5",
    basicInfo: {
      isFirm: true,
      companyName: "شرکت صنایع غذایی سلامت",
      nationalCode: "3012345678",
      taxId: "3456789012",
      customerType: CustomerType.BOTH
    },
    contactInfo: {
      addresses: [{
        address: "تهران، خیابان پاسداران، پلاک 567",
        postalCode: "3456789012",
        city: "تهران"
      }],
      phones: ["021-34567890", "09123456786"],
      email: "info@healthfood.ir",
      website: "www.healthfood.ir"
    },
    additionalDetails: {
      notes: "تولیدکننده مواد غذایی",
      preferredContactMethod: "email",
      tags: ["غذایی", "تولید"]
    }
  }
]; 