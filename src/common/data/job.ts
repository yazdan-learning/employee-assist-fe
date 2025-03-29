//import images
import avatar1 from "../../assets/images/users/avatar-1.jpg";
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import avatar3 from "../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../assets/images/users/avatar-4.jpg";
import avatar5 from "../../assets/images/users/avatar-5.jpg";
import avatar6 from "../../assets/images/users/avatar-6.jpg";
import avatar7 from "../../assets/images/users/avatar-7.jpg";
import avatar8 from "../../assets/images/users/avatar-8.jpg";

//import images
import adobe from "assets/images/companies/adobe.svg";
import adobephotoshop from "assets/images/companies/adobe-photoshop.svg";
import airbnb from "assets/images/companies/airbnb.svg";
import amazon from "assets/images/companies/amazon.svg";
import flutter from "assets/images/companies/flutter.svg";
import mailchimp from "assets/images/companies/mailchimp.svg";
import line from "assets/images/companies/line.svg";
import spotify from "assets/images/companies/spotify.svg";
import wordpress from "assets/images/companies/wordpress.svg";
import upwork from "assets/images/companies/upwork.svg";
import sass from "assets/images/companies/sass.svg";
import reddit from "assets/images/companies/reddit.svg";

const jobs = [
    {
        id: 1,
        jobId: "#SK2540",
        title: "Magento Developer",
        companyName: "Themesbrand",
        location: "California",
        experience: "0-2 Years",
        position: 2,
        selectType: "Full Time",
        typeBadgeColor: "success",
        postedDate: "02 June 2021",
        lastDate: "25 June 2021",
        status: "Active",
        statusBadgeColor: "success",
    },
    {
        id: 2,
        jobId: "#SK2541",
        title: "Product Designer",
        companyName: "Web Technology pvt.ltd",
        location: "California",
        experience: "1-2 Years",
        position: 3,
        selectType: "Part Time",
        typeBadgeColor: "danger",
        postedDate: "15 June 2021",
        lastDate: "28 June 2021",
        status: "New",
        statusBadgeColor: "info",
    },
    {
        id: 3,
        jobId: "#SK2542",
        title: "Marketing Director",
        companyName: "Creative Agency",
        location: "Phoenix",
        experience: "-",
        position: 5,
        selectType: "Full Time",
        typeBadgeColor: "success",
        postedDate: "02 June 2021",
        lastDate: "25 June 2021",
        status: "Close",
        statusBadgeColor: "danger",
    },
    {
        id: 4,
        jobId: "#SK2543",
        title: "HTML Developer",
        companyName: "Web Technology pvt.ltd",
        location: "California",
        experience: "0-4 Years",
        position: 8,
        selectType: "Full Time",
        typeBadgeColor: "success",
        postedDate: "02 June 2021",
        lastDate: "25 June 2021",
        status: "Active",
        statusBadgeColor: "success",
    },
    {
        id: 5,
        jobId: "#SK2544",
        title: "Product Sales Specialist",
        companyName: "Skote Technology pvt.Ltd",
        location: "Louisiana",
        experience: "5+ Years",
        position: 1,
        selectType: "Part Time",
        typeBadgeColor: "danger",
        postedDate: "02 June 2021",
        lastDate: "25 June 2021",
        status: "New",
        statusBadgeColor: "info",
    },
    {
        id: 6,
        jobId: "#SK2545",
        title: "Magento Developer",
        companyName: "New Technology pvt.ltd",
        location: "Oakridge Lane Richardson",
        experience: "0-2 Years",
        position: 2,
        selectType: "Freelance",
        typeBadgeColor: "info",
        postedDate: "02 June 2021",
        lastDate: "25 June 2021",
        status: "New",
        statusBadgeColor: "info",
    },
    {
        id: 7,
        jobId: "#SK2546",
        title: "Business Associate",
        companyName: "Web Technology pvt.ltd",
        location: "California",
        experience: "0-2 Years",
        position: 2,
        selectType: "Full Time",
        typeBadgeColor: "success",
        postedDate: "02 June 2021",
        lastDate: "25 June 2021",
        status: "Active",
        statusBadgeColor: "success",
    },
    {
        id: 8,
        jobId: "#SK2547",
        title: "Magento Developer",
        companyName: "Adobe Agency",
        location: "California",
        experience: "0-2 Years",
        position: 2,
        selectType: "Full Time",
        typeBadgeColor: "success",
        postedDate: "02 June 2021",
        lastDate: "25 June 2021",
        status: "Close",
        statusBadgeColor: "danger",
    },
    {
        id: 9,
        jobId: "#SK2548",
        title: "HTML Developer",
        companyName: "Web Technology pvt.ltd",
        location: "California",
        experience: "0-2 Years",
        position: 2,
        selectType: "Part Time",
        typeBadgeColor: "danger",
        postedDate: "02 June 2021",
        lastDate: "25 June 2021",
        status: "New",
        statusBadgeColor: "info",
    },
    {
        id: 10,
        jobId: "#SK2549",
        title: "Marketing Director",
        companyName: "Web Technology pvt.ltd",
        location: "California",
        experience: "0-2 Years",
        position: 2,
        selectType: "Internship",
        typeBadgeColor: "warning",
        postedDate: "02 June 2021",
        lastDate: "25 June 2021",
        status: "Active",
        statusBadgeColor: "success",
    },
];

const jobListCandidate = [
    {
        id: 1,
        img: avatar1,
        name: "Steven Franklin",
        designation: "UI/UX Designer",
        location: "Louisiana",
        experience: "38",
        skills: ["Bootstrap", "HTML", "CSS"],
        type: "Full Time",
    },
    {
        id: 2,
        img: avatar2,
        name: "Dolores Minter",
        designation: "Assistant / Shope Keeper",
        location: "Hong-Kong",
        experience: "25",
        skills: ["Shope", "Assistant"],
        type: "Freelance",
    },
    {
        id: 3,
        img: avatar3,
        name: "Charles Brown",
        designation: "Web Designer",
        location: "Finlande",
        experience: "24",
        skills: ["Bootstrap", "HTML", "SASS"],
        type: "Part Time",
    },
    {
        id: 4,
        img: avatar4,
        name: "Bonnie Harney",
        designation: "Web Developer",
        location: "France",
        experience: "47",
        skills: ["MYSQL", "PHP", "Laravel"],
        type: "Internship",
    },
    {
        id: 5,
        img: avatar5,
        name: "Stephen Hadley",
        designation: "Graphic Designer",
        location: "Danemark",
        experience: "83",
        skills: ["Figma", "Adobe XD", "Sketch"],
        type: "Internship",
    },
    {
        id: 6,
        img: avatar6,
        name: "Henry Wells",
        designation: "Executive, HR Operations",
        location: "Danemark",
        experience: "65",
        skills: ["HR", "Executive", "Professional"],
        type: "Internship",
    },
    {
        id: 7,
        img: avatar7,
        name: "Adam Miller",
        designation: "Education Training",
        location: "Colombie",
        experience: "38",
        skills: ["Teaching", "React", "Training"],
        type: "Full Time",
    },
    {
        id: 8,
        img: avatar8,
        name: "Keith Gonzales",
        designation: "Product Manager",
        location: "Brazil",
        experience: "50",
        skills: ["Manager", "Business", "Product"],
        type: "Freelance",
    },
];

const jobApply = [
    {
        id: 10,
        no: 10,
        jobTitle: "Magento Developer",
        companyName: "Web Technology pvt.Ltd",
        type: "Internship",
        applyDate: "02 June 2021",
        status: "Active",
    },
    {
        id: 9,
        no: 9,
        jobTitle: "Magento Developer",
        companyName: "Adobe Agency",
        type: "Freelance",
        applyDate: "02 June 2021",
        status: "New",
    },
    {
        id: 8,
        no: 8,
        jobTitle: "Magento Developer",
        companyName: "Web Technology pvt.Ltd",
        type: "Full Time",
        applyDate: "02 June 2021",
        status: "Close",
    },
    {
        id: 7,
        no: 7,
        jobTitle: "Magento Developer",
        companyName: "Web Technology pvt.Ltd",
        type: "Part Time",
        applyDate: "25 June 2021",
        status: "Active",
    },
    {
        id: 6,
        no: 6,
        jobTitle: "Magento Developer",
        companyName: "Themesbrand",
        type: "Freelance",
        applyDate: "25 June 2021",
        status: "Close",
    },
    {
        id: 5,
        no: 5,
        jobTitle: "Product Sales Specialist",
        companyName: "New Technology pvt.Ltd",
        type: "Part Time",
        applyDate: "25 June 2021",
        status: "New",
    },
    {
        id: 4,
        no: 4,
        jobTitle: "HTML Developer",
        companyName: "Skote Technology pvt.Ltd",
        type: "Full Time",
        applyDate: "02 June 2021",
        status: "Active",
    },
    {
        id: 3,
        no: 3,
        jobTitle: "Magento Developer",
        companyName: "Web Technology pvt.Ltd",
        type: "Full Time",
        applyDate: "02 June 2021",
        status: "Close",
    },
    {
        id: 2,
        no: 2,
        jobTitle: "Apple School & College",
        companyName: "Themesbrand",
        type: "Part Time",
        applyDate: "15 June 2021",
        status: "New",
    },
    {
        id: 1,
        no: 1,
        jobTitle: "Magento Developer",
        companyName: "Creative Agency",
        type: "Full Time",
        applyDate: "02 June 2021",
        status: "Active",
    },
];


const jobsGridData = [
    {
        id: 1,
        img: adobe,
        title: "Magento Developer",
        location: "California",
        companyName: 'Skote Technology Pvt.Ltd'
    },
    {
        id: 2,
        img: adobephotoshop,
        title: "Product Designer",
        location: "California",
        companyName: 'Skote Technology Pvt.Ltd'
    },
    {
        id: 3,
        img: airbnb,
        title: "Marketing Director",
        location: "California",
        companyName: 'Skote Technology Pvt.Ltd'
    },
    {
        id: 4,
        img: amazon,
        title: "Project Manager"
        , location: "California",
        companyName: 'Skote Technology Pvt.Ltd'
    },
    {
        id: 5,
        img: flutter,
        title: "HTML Developer"
        , location: "California",
        companyName: 'Skote Technology Pvt.Ltd'
    },
    {
        id: 6,
        img: mailchimp,
        title: "Business Associate",
        location: "California",
        companyName: 'Skote Technology Pvt.Ltd'
    },
    {
        id: 7,
        img: line,
        title: "Product Sales Spec,ialist",
        location: "California",
        companyName: 'Skote Technology Pvt.Ltd'
    },
    {
        id: 8,
        img: spotify,
        title: "Magento Developer",
        location: "California",
        companyName: 'Skote Technology Pvt.Ltd'
    },
    {
        id: 9,
        img: wordpress,
        title: "Magento Developer",
        location: "California",
        companyName: 'Skote Technology Pvt.Ltd'
    },
    {
        id: 10,
        img: upwork,
        title: "Magento Developer",
        location: "California",
        companyName: 'Skote Technology Pvt.Ltd'
    },
    {
        id: 11,
        img: sass,
        title: "Magento Developer",
        location: "California",
        companyName: 'Skote Technology Pvt.Ltd'
    },
    {
        id: 12,
        img: reddit,
        title: "Magento Developer",
        location: "California",
        companyName: 'Skote Technology Pvt.Ltd'
    },
]
export { jobs, jobListCandidate, jobApply, jobsGridData };