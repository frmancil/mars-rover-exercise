import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

let component: AppComponent;
let fixture: ComponentFixture<AppComponent>;

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`should function loadFile`, () => {
    spyOn(component, 'loadFile').and.callThrough();
    const file = new File(['5 5\n1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM'], 'instructions', { type: 'text/html' });
    const $event = { target: { files: [file] } };
    component.loadFile($event);
    expect(component.loadFile).toHaveBeenCalled;
  });

  it(`should function loadFile null`, () => {
    spyOn(component, 'loadFile').and.callThrough();
    const file = null;
    const $event = { target: { files: [file] } };
    component.loadFile($event);
    expect(component.loadFile).toHaveBeenCalled;
  });

  it(`should function setRoverToStart`, () => {
    spyOn(component, 'setRoverToStart').and.callThrough();
    const instruction = ['5 5', '1 2 N', 'LMLMLMLMM', '3 3 E', 'MMRMMRMRRM'];
    component.fileInstructions = instruction;
    component.setRoverToStart();
    expect(component.resultLabel).toBe('<br><strong>13N</strong><br><strong>51E</strong>');
  });

  it(`should function setRoverToStart empty`, () => {
    spyOn(component, 'setRoverToStart').and.callThrough();
    const instruction = [''];
    component.fileInstructions = instruction;
    component.setRoverToStart();
    expect(component.setRoverToStart).toHaveBeenCalled;
  });

  it(`should function setRoverToStart out of plateau`, () => {
    spyOn(component, 'setRoverToStart').and.callThrough();
    const instruction = ['5 5', '5 5 N', 'MMM'];
    component.fileInstructions = instruction;
    component.setRoverToStart();
    expect(component.setRoverToStart).toHaveBeenCalled;
  });

  it(`should function setRoverToStart collided rovers`, () => {
    spyOn(component, 'setRoverToStart').and.callThrough();
    const instruction = ['5 5', '1 2 N', 'LMLMLMLMM', '1 2 N', 'LMLMLMLMM'];
    component.fileInstructions = instruction;
    component.setRoverToStart();
    expect(component.setRoverToStart).toHaveBeenCalled;
  });

  it(`should function setRoverToStart out of plateau by south`, () => {
    spyOn(component, 'setRoverToStart').and.callThrough();
    const instruction = ['5 5', '0 0 S', 'MMM'];
    component.fileInstructions = instruction;
    component.setRoverToStart();
    expect(component.setRoverToStart).toHaveBeenCalled;
  });

  it(`should function setRoverToStart coordinates validation`, () => {
    spyOn(component, 'setRoverToStart').and.callThrough();
    const instruction = ['5 ', '0 0 S', 'MMM'];
    component.fileInstructions = instruction;
    component.setRoverToStart();
    expect(component.setRoverToStart).toHaveBeenCalled;
  });

  it(`should function setRoverToStart location validation`, () => {
    spyOn(component, 'setRoverToStart').and.callThrough();
    const instruction = ['5 5', '0  S', 'MMM'];
    component.fileInstructions = instruction;
    component.setRoverToStart();
    expect(component.setRoverToStart).toHaveBeenCalled;
  });

  it(`should function setRoverToStart instruction validation`, () => {
    spyOn(component, 'setRoverToStart').and.callThrough();
    const instruction = ['5 5', '0 0 S', 'A'];
    component.fileInstructions = instruction;
    component.setRoverToStart();
    expect(component.setRoverToStart).toHaveBeenCalled;
  });

  it(`should function setRoverToStart coordinates empty`, () => {
    spyOn(component, 'setRoverToStart').and.callThrough();
    const instruction = ['', '0 0 S', 'A'];
    component.fileInstructions = instruction;
    component.setRoverToStart();
    expect(component.setRoverToStart).toHaveBeenCalled;
  });

  it(`should function setRoverToStart location empty`, () => {
    spyOn(component, 'setRoverToStart').and.callThrough();
    const instruction = ['5 5', '', 'A'];
    component.fileInstructions = instruction;
    component.setRoverToStart();
    expect(component.setRoverToStart).toHaveBeenCalled;
  });

  it(`should function setRoverToStart instruction empty`, () => {
    spyOn(component, 'setRoverToStart').and.callThrough();
    const instruction = ['5 5', '1 2 N', ''];
    component.fileInstructions = instruction;
    component.setRoverToStart();
    expect(component.setRoverToStart).toHaveBeenCalled;
  });

});
