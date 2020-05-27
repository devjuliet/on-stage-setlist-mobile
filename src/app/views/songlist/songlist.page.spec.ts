import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SonglistPage } from './songlist.page';

describe('SonglistPage', () => {
  let component: SonglistPage;
  let fixture: ComponentFixture<SonglistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SonglistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SonglistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
