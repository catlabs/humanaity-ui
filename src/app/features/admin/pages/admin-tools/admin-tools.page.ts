import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppHeaderComponent } from '../../../../shared/components/app-header/app-header.component';
import { TimelineNodeComponent } from '../../../../shared/components/timeline-node/timeline-node.component';

interface TimelineItem {
  title: string;
  period: string;
  reasoning: string;
}

@Component({
  selector: 'app-admin-tools',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    AppHeaderComponent,
    TimelineNodeComponent
  ],
  templateUrl: './admin-tools.page.html',
  styleUrl: './admin-tools.page.scss'
})
export class AdminToolsPage {
  inventions = signal<TimelineItem[]>([
    {
      title: 'Fire Control',
      period: 'Prehistoric Era',
      reasoning: 'First major technological breakthrough enabling cooking, warmth, and protection. Essential prerequisite for all subsequent innovations.'
    },
    {
      title: 'Stone Tools',
      period: 'Stone Age',
      reasoning: 'Building on fire control, shaped stones provided cutting and hunting advantages, leading to improved food processing capabilities.'
    },
    {
      title: 'Agriculture',
      period: 'Neolithic Period',
      reasoning: 'Combination of tools and fire control enabled systematic food production, creating surplus and permanent settlements.'
    },
    {
      title: 'The Wheel',
      period: 'Bronze Age',
      reasoning: 'Agricultural surplus created need for transportation. Wheel revolutionized movement of goods and people across settlements.'
    },
    {
      title: 'Writing Systems',
      period: 'Ancient Civilizations',
      reasoning: 'Complex societies required record-keeping. Writing enabled knowledge preservation and administrative organization.'
    },
    {
      title: 'Printing Press',
      period: 'Renaissance',
      reasoning: 'Writing systems established information value. Mass production of texts democratized knowledge and accelerated learning.'
    }
  ]);

  artisticMovements = signal<TimelineItem[]>([
    {
      title: 'Cave Paintings',
      period: 'Prehistoric Art',
      reasoning: 'First human artistic expression, driven by need to communicate experiences and spiritual beliefs through visual representation.'
    },
    {
      title: 'Classical Realism',
      period: 'Ancient Greece/Rome',
      reasoning: 'Advanced civilizations developed sophisticated techniques to capture human form and idealized beauty, establishing artistic standards.'
    },
    {
      title: 'Renaissance',
      period: '14th-17th Century',
      reasoning: 'Revival of classical ideals combined with scientific understanding of perspective and anatomy, creating unprecedented realism.'
    },
    {
      title: 'Impressionism',
      period: '19th Century',
      reasoning: 'Photography challenged traditional realism, leading artists to explore light, color, and momentary impressions rather than precise detail.'
    },
    {
      title: 'Abstract Art',
      period: 'Early 20th Century',
      reasoning: 'Rejection of representational art in favor of pure form, color, and emotion, reflecting modern industrial and philosophical changes.'
    },
    {
      title: 'Digital Art',
      period: 'Late 20th Century',
      reasoning: 'Computer technology enabled entirely new creative possibilities, democratizing art creation and distribution through digital platforms.'
    }
  ]);

  philosophicalIdeas = signal<TimelineItem[]>([
    {
      title: 'Mythological Thinking',
      period: 'Prehistoric Societies',
      reasoning: 'Early humans explained natural phenomena through supernatural narratives, establishing first systematic worldview frameworks.'
    },
    {
      title: 'Pre-Socratic Philosophy',
      period: 'Ancient Greece 6th Century BC',
      reasoning: 'Shift from mythological to rational explanations of reality, questioning fundamental nature of existence and change.'
    },
    {
      title: 'Socratic Method',
      period: 'Classical Athens',
      reasoning: 'Development of systematic questioning and logical reasoning, establishing foundations for critical thinking and knowledge acquisition.'
    },
    {
      title: 'Scholasticism',
      period: 'Medieval Period',
      reasoning: 'Integration of Aristotelian logic with religious doctrine, creating systematic theological and philosophical frameworks.'
    },
    {
      title: 'Empiricism',
      period: '17th-18th Century',
      reasoning: 'Emphasis on sensory experience and observation as primary sources of knowledge, challenging purely rational approaches.'
    },
    {
      title: 'Existentialism',
      period: '19th-20th Century',
      reasoning: 'Focus on individual existence, freedom, and choice in response to modern alienation and loss of traditional certainties.'
    }
  ]);

  onGenerateNextInvention(): void {
    // TODO: Implement AI generation of next invention
    console.log('Generate next invention');
  }

  onGenerateNextArtisticStage(): void {
    // TODO: Implement AI generation of next artistic stage
    console.log('Generate next artistic stage');
  }

  onGenerateNextIdea(): void {
    // TODO: Implement AI generation of next philosophical idea
    console.log('Generate next idea');
  }
}


