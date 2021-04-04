import { Component, OnInit } from '@angular/core';
import { Rover } from '../models/rover';
import { Location } from '../models/location';
import { Plateau } from '../models/plateau';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService]
})
export class AppComponent implements OnInit {
  title = 'mars-rover-exercise';

  constructor(private messageService: MessageService) { }

  roversSent: Rover[];
  roversInPlateau: Rover[];
  roversMissed: Rover[];
  plateau: Plateau;
  fileInstructions: any[];
  plateauCoordinatesPattern = new RegExp('^[0-9_]+( [0-9_]+)$');
  locationPattern = new RegExp('^[0-9_]+( [0-9_]+)+( [a-zA-Z_]+)$');
  moveSetPattern = new RegExp('^[LlRrMm]+$');
  resultLabel: any;
  startExecution = false;

  ngOnInit(): void {
    this.roversSent = [];
    this.plateau = new Plateau();
  }

  // Load the selected file from local drive
  public loadFile($event: any): void {
    this.readFile($event.target);
    this.startExecution = true;
  }

  // Read the selected file and split the lines to obtain the rover's instructions
  public readFile(instructions: any): void {
    let instructionsString;
    this.fileInstructions = [];
    const instructionFile: File = instructions.files[0];
    const instructionReader: FileReader = new FileReader();
    if (!this.isNullOrUndefined(instructionFile)) {
      instructionReader.readAsText(instructionFile);
      instructionReader.onloadend = (e) => {
        instructionsString = instructionReader.result;
        for (const line of instructionsString.split(/[\r\n]+/)) {
          this.fileInstructions.push(line);
        }
      };
    }
  }


  // Validate if the instructions in the file are correct in form and values
  public validateInstructionsFile(): boolean {
    if (this.fileInstructions.length === 1 && this.fileInstructions[0] === '') {
      this.messageService.add({
        severity: 'error', summary: 'Error reading file',
        detail: 'File is empty.'
      });
      return false;
    }
    if (!this.validatePlateauCoordinates()) {
      this.messageService.add({
        severity: 'warn', summary: 'Plateau Coordinates',
        detail: 'Coordinates are invalid.'
      });
      return false;
    }
    if (!this.validateRoverInstructions()) {
      this.messageService.add({
        severity: 'warn', summary: 'Rover Instructions',
        detail: 'There is an invalid instruction setted to a rover.'
      });
      return false;
    }
    this.messageService.add({
      severity: 'success', summary: 'Read File',
      detail: 'File is valid.'
    });
    return true;
  }

  // Validate if the plateau coordinates in the file exists and keeps the example pattern
  public validatePlateauCoordinates(): any {
    if (!this.isNullOrUndefined(this.fileInstructions[0]) && this.fileInstructions[0].length > 0) {
      return this.plateauCoordinatesPattern.test(this.fileInstructions[0]);
    } else {
      return false;
    }
  }

  // Validate if the rover instructions in the file exists and keeps the example pattern
  public validateRoverInstructions(): boolean {
    for (let i = 1; i < this.fileInstructions.length; i = i + 2) {
      if (!this.isNullOrUndefined(this.fileInstructions[i]) && this.fileInstructions[i].length > 0) {
        if (!this.locationPattern.test(this.fileInstructions[i])) {
          return false;
        }
      }
      if (!this.isNullOrUndefined(this.fileInstructions[i + 1]) && this.fileInstructions[i + 1].length > 0) {
        if (!this.moveSetPattern.test(this.fileInstructions[i + 1])) {
          return false;
        }
      }
    }
    return true;
  }

  // Start the execution of the different methods to move the rovers, and print the result of the run
  public setRoverToStart(): void {
    this.resultLabel = '';
    this.cleanLastExecution();
    if (this.validateInstructionsFile()) {
      this.createRoverToSend();
      this.getPlateauLimit();
      this.moveRoverInPlateau();
      this.showLandingResult();
    }
  }

  // Clean the last execution values
  public cleanLastExecution(): void {
    this.roversSent = [];
    this.roversInPlateau = [];
    this.roversMissed = [];
  }

  // Generate the result of the execution of the rovers run
  public showLandingResult(): void {
    if (this.roversInPlateau.length > 0) {
      for (const roverLanded of this.roversInPlateau) {
        this.resultLabel = this.resultLabel.concat('<br><strong>' + roverLanded.roverLocation.x + '' +
          roverLanded.roverLocation.y + roverLanded.roverLocation.direction + '</strong>');
      }
    }
  }

  // Obtain the rover instructions to add into a new rover
  public getRoverInstruction(instructionLine: any): any {
    const instructionToAdd = [];
    for (let i = 0; i < instructionLine.length; i++) {
      instructionToAdd[i] = instructionLine[i];
    }
    return instructionToAdd;
  }

  // Obtain the rover location and create a new location object to set into a new rover
  public getRoverLocation(locationLine: any): Location {
    const locationToAdd = new Location();
    locationToAdd.x = Number(locationLine.split(' ')[0]);
    locationToAdd.y = Number(locationLine.split(' ')[1]);
    locationToAdd.direction = locationLine.split(' ')[2];
    return locationToAdd;
  }

  // Create the rovers to send to the plateau, setting them their corresponding location and instruction
  public createRoverToSend(): void {
    for (let i = 1; i < this.fileInstructions.length; i = i + 2) {
      const rover = new Rover();
      rover.roverLocation = this.getRoverLocation(this.fileInstructions[i]);
      rover.roverInstruction = this.getRoverInstruction(this.fileInstructions[i + 1]);
      this.roversSent.push(rover);
    }
  }

  // Obtain the current plateau limits
  public getPlateauLimit(): any {
    this.plateau.x = Number(this.fileInstructions[0].split(' ')[0]);
    this.plateau.y = Number(this.fileInstructions[0].split(' ')[1]);
  }

  // Method to run every rover created according to their instructions
  public moveRoverInPlateau(): void {
    this.roversInPlateau = [];
    this.roversMissed = [];
    for (const roverSent of this.roversSent) {
      const currentRover = JSON.parse(JSON.stringify(roverSent));
      currentRover.roverInstruction.forEach(instruction => {
        this.roverStart(currentRover, instruction);
      });
      if (this.roverOutOfPlateauCheck(currentRover)) {
        this.messageService.add({
          severity: 'warn', summary: 'Rover missed',
          detail: 'Rover has landed outside the plateau.'
        });
        this.roversMissed.push(currentRover);
      } else {
        if (this.roverCollisionInPlateau(currentRover, this.roversInPlateau)) {
          this.messageService.add({
            severity: 'warn', summary: 'Rover collided',
            detail: 'Rover has collided in their run.'
          });
          this.roversMissed.push(currentRover);
        } else {
          this.roversInPlateau.push(currentRover);
        }
      }
    }
  }

  // Method to move a rover depending on their instructions
  public roverStart(currentRover: any, instruction: any): void {
    if (instruction.toUpperCase() === 'L') {
      currentRover.roverLocation.direction = this.turnLeft(currentRover);
    } else if (instruction.toUpperCase() === 'R') {
      currentRover.roverLocation.direction = this.turnRight(currentRover);
    } else if (instruction.toUpperCase() === 'M') {
      this.moveForward(currentRover);
    }
  }

  // Turn left movement depending on the rover actual direction
  public turnLeft(currentRover: any): any {
    switch (currentRover.roverLocation.direction.toUpperCase()) {
      case 'N': {
        return 'W';
      }
      case 'S': {
        return 'E';
      }
      case 'E': {
        return 'N';
      }
      case 'W': {
        return 'S';
      }
      default: break;
    }
  }

  // Turn right movement depending on the rover actual direction
  public turnRight(currentRover: any): any {
    switch (currentRover.roverLocation.direction.toUpperCase()) {
      case 'N': {
        return 'E';
      }
      case 'S': {
        return 'W';
      }
      case 'E': {
        return 'S';
      }
      case 'W': {
        return 'N';
      }
      default: break;
    }
  }

  // Forward movement depending on the rover actual direction
  public moveForward(currentRover: any): void {
    switch (currentRover.roverLocation.direction.toUpperCase()) {
      case 'N': {
        currentRover.roverLocation.y++;
        break;
      }
      case 'S': {
        currentRover.roverLocation.y--;
        break;
      }
      case 'E': {
        currentRover.roverLocation.x++;
        break;
      }
      case 'W': {
        currentRover.roverLocation.x--;
        break;
      }
      default: break;
    }
  }

  // Validate if the rover result outside of the bounds of the plateau because of their instructions
  public roverOutOfPlateauCheck(movedRover: any): boolean {
    if (movedRover.roverLocation.x < 0 || movedRover.roverLocation.y < 0) {
      return true;
    }
    if (movedRover.roverLocation.x > this.plateau.x ||
      movedRover.roverLocation.y > this.plateau.y) {
      return true;
    }
    return false;
  }

  // Validate if the rover collide with another rover that is already present in the plateau
  public roverCollisionInPlateau(movedRover: any, roversInPlateau: any): boolean {
    if (roversInPlateau.length > 0) {
      for (const roverInPlateau of roversInPlateau) {
        if ((movedRover.roverLocation.x === roverInPlateau.roverLocation.x) &&
          (movedRover.roverLocation.y === roverInPlateau.roverLocation.y)) {
          return true;
        }
      }
    } else {
      return false;
    }
  }

  // Utility to check if an object is null or undefined
  public isNullOrUndefined<T>(obj: T | null | undefined): obj is null | undefined {
    return typeof obj === 'undefined' || obj === null;
  }

}
