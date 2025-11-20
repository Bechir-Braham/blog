import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface ProjectLink {
  label: string;
  url: string;
  icon: string;
  primary: boolean;
}

interface Project {
  id: number;
  name: string;
  description: string;
  technologies: string[];
  links: ProjectLink[];
}

@Component({
  selector: 'app-projects',
  imports: [RouterLink, CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class ProjectsComponent {
  allProjects: Project[] = [
    {
      id: 2,
      name: 'Postgres Database Replicator',
      description: 'A database replication system that uses PostgreSQL triggers for inserts and updates, combined with RabbitMQ to broadcast changes to all database replicators. Implements async Python and uses PostgreSQL LISTEN/NOTIFY commands for efficient change detection. Changes are persisted in RabbitMQ and replicated to multiple databases asynchronously.',
      technologies: ['Python', 'PostgreSQL', 'RabbitMQ', 'Async/Await', 'SQL Triggers'],
      links: [
        { label: 'GitHub', url: 'https://github.com/Bechir-Braham/postgres-database-replicator', icon: '🐙', primary: true },
        { label: 'Article', url: 'https://hackernoon.com/replicate-postgresql-databases-using-async-python-and-rabbitmq-for-high-availability', icon: '📝', primary: false }
      ]
    },
    {
      id: 3,
      name: 'Digit Recognition with Deep Learning',
      description: 'An end-to-end machine learning project for recognizing hand-written digits. Users can draw any number on a canvas in a web interface and the application returns the predicted digit. Built with TensorFlow and sklearn models, deployed using a Django API server on Azure for ML inference and a user-facing Django frontend on Heroku. Implements Singleton design pattern for efficient model loading.',
      technologies: ['TensorFlow', 'scikit-learn', 'Django', 'Python', 'Deep Learning', 'Azure', 'Heroku'],
      links: [
        { label: 'GitHub', url: 'https://github.com/Bechir-Braham/number-guesser', icon: '🐙', primary: true },
      ]
    },
    {
      id: 4,
      name: 'Strawberry Farm Yield Estimator',
      description: 'A computer vision project to estimate strawberry farm yield by detecting and classifying ripe and unripe strawberries. Led a team of 4 interns to design, test, and deploy a YOLO-based deep learning model on an agricultural autonomous robot. Achieved an mAP (mean average precision) of 0.82 and deployed the model with a web interface as a prototype for real-world agricultural applications.',
      technologies: ['YOLO', 'Computer Vision', 'Deep Learning', 'Python', 'Object Detection', 'TensorFlow'],
      links: [
        { label: 'GitHub', url: 'https://github.com/Bechir-Braham/strawberry-farm-yield-estimator', icon: '🐙', primary: true },
        { label: 'Presentation', url: 'https://www.canva.com/design/DAE9tadPulI/4feRXNLWqftLHEikevf5wA/view', icon: '📊', primary: false }
      ]
    },
    {
      id: 5,
      name: 'Distributed Image Embedding with Spark',
      description: 'A distributed computing project to build an embedding database for reverse image search. Implements data parallelism by distributing a ResNet TensorFlow model across multiple Apache Spark nodes for large-scale image inference. The generated image embeddings are stored in a Pinecone vector database, enabling efficient similarity search and reverse image lookup at scale.',
      technologies: ['Apache Spark', 'TensorFlow', 'ResNet', 'Pinecone', 'Docker', 'Python', 'Vector Database'],
      links: [
        { label: 'GitHub', url: 'https://github.com/Bechir-Braham/spark-tensorflow-inference', icon: '🐙', primary: true }
      ]
    },
    {
      id: 6,
      name: 'End-to-End Encrypted Chat',
      description: 'A secure messaging application with LDAP authentication using Apache Directory Studio. Implements end-to-end encryption where clients generate private keys and certificate signing requests. The Certificate Authority server stores signed certificates for each user. Messages are encrypted with the recipient\'s public key and can only be decrypted by the recipient using their private key, ensuring complete message privacy.',
      technologies: ['Python', 'LDAP', 'PKI', 'Cryptography', 'Apache Directory Studio', 'Certificate Authority'],
      links: [
        { label: 'GitHub', url: 'https://github.com/Bechir-Braham/e2e-encrypted-chat', icon: '🐙', primary: true }
      ]
    },
    {
      id: 1,
      name: 'Personal Terminal Website',
      description: 'An interactive terminal-style personal website built with vanilla HTML, CSS, and JavaScript. Features command-line interface, keyboard navigation, command history, and tab completion. Showcases creative UI/UX design with retro computing aesthetics.',
      technologies: ['Angular', 'Pre-rendering',  'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'Responsive Design'],
      links: [
        { label: 'GitHub', url: 'https://github.com/Bechir-Braham', icon: '🐙', primary: true },
        { label: 'Live Demo', url: '/', icon: '🔗', primary: false }
      ]
    },
  ];

  openProjectLink(url: string, label: string): void {
    if (url === '#') {
      // Show demo notification for placeholder links
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-info text-black p-4 rounded shadow-lg z-50';
      notification.innerHTML = `
        <strong>Project Link</strong><br>
        <small>${label} would open here in a real implementation</small>
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 2000);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
}
