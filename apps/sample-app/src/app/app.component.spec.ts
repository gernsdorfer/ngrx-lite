import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [storeTestingFactory()],
    }).compileComponents();
  });

  const getApp = () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return {
      component,
    };
  };
  it('should be defined', () => {
    expect(getApp()).toBeDefined();
  });
});