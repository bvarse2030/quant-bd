/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface IStory {
  id: string;
  name: string;
  image: string;
  university: string;
  subject: string;
  description: string;
}

export interface ISection11Data {
  id: string;
  stories: IStory[];
  storiesPerPage: number;
}

export interface Section11Props {
  data?: ISection11Data | string;
}

export const defaultDataSection11: ISection11Data = {
  id: 'section-11-stories-reel',
  storiesPerPage: 1,
  stories: [
    {
      id: 'story-001',
      name: 'Jaswanth Vishnumolakala',
      image: 'https://i.ibb.co.com/KpGnqS3D/nature.jpg',
      university: 'University of Buckingham',
      subject: 'BSc Computing (AI & Robotics)',
      description:
        "Jaswanth achieved a First Class Bachelor's degree. His time at the university was transformative, fostering both personal and professional growth.",
    },
    {
      id: 'story-002',
      name: 'Sarah Jenkins',
      image: 'https://i.ibb.co.com/KpGnqS3D/nature.jpg',
      university: 'Stanford University',
      subject: 'MSc Computer Science',
      description:
        'Sarah led the Google Developer Student Club and published three research papers on Machine Learning. She is now working as a Lead AI Researcher at OpenAI.',
    },
    {
      id: 'story-003',
      name: 'Michael Chen',
      image: 'https://i.ibb.co.com/KpGnqS3D/nature.jpg',
      university: 'MIT',
      subject: 'BEng Electrical Engineering',
      description:
        'Michael developed a patent-pending solar technology during his junior year. His dedication to sustainable energy has earned him the Green Tech Innovator Award.',
    },
  ],
};
