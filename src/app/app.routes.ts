import { Routes } from '@angular/router';
import { TerminalComponent } from './terminal/terminal';
import { ContactComponent } from './contact/contact';
import { ResumeComponent } from './resume/resume';
import { BlogComponent } from './blog/blog';
import { ProjectsComponent } from './projects/projects';

export const routes: Routes = [
  { path: '', component: TerminalComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'resume', component: ResumeComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: '**', redirectTo: '' }
];
