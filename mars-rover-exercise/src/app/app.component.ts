import { Component } from '@angular/core';
import { Rover } from '../models/rover';
import { Location } from '../models/location';
import { Plateau } from '../models/plateau';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mars-rover-exercise';

  roverInstructions: any;
  roverLocation: any;
  plateauSize: any;
  roversSent: Rover[];
  roversInPlateau: Rover[];
  plateau: Plateau;

  ngOnInit() {
    this.roversSent = [];
  }

  public getRoverInstruction(): any {
    if (!this.isNullOrUndefined(this.roverInstructions)) {
      let instructionToAdd = [];
      for (let i = 0; i < this.roverInstructions.length; i++) {
        instructionToAdd[i] = this.roverInstructions[i];
      }
      return instructionToAdd;
    }
  }

  public getRoverLocation(): any {
    if (!this.isNullOrUndefined(this.roverLocation)) {
      let locationToAdd = new Location;
      locationToAdd.position_x = parseInt(this.roverLocation.split(' ')[0]);
      locationToAdd.position_y = parseInt(this.roverLocation.split(' ')[1]);
      locationToAdd.direction = this.roverLocation.split(' ')[2];
      return locationToAdd;
    }
  }

  public createRoverToSend(roverLocation: any, roverInstructions: any) {
    let rover = new Rover;
    rover.roverLocation = roverLocation;
    rover.roverInstruction = roverInstructions;
    this.roversSent.push(rover);
    console.log(this.roversSent[0].roverInstruction);
  }

  public setRoverToStart() {
    this.createRoverToSend(this.getRoverLocation(), this.getRoverInstruction());
    this.moveRoverInPlateau();
  }

  public getPlateauLimit(): any {
    if (!this.isNullOrUndefined(this.roverLocation)) {
      this.plateau.plateau_x = parseInt(this.plateauSize.split(' ')[0]);
      this.plateau.plateau_y = parseInt(this.plateauSize.split(' ')[1]);
    }
  }

  public moveRoverInPlateau() {
    this.roversInPlateau = [];
    for (const roverSent of this.roversSent) {
      const currentRover = JSON.parse(JSON.stringify(roverSent))
      currentRover.roverInstruction.forEach(instruction => {
        this.roverStart(currentRover, instruction);
        this.roversInPlateau.push(currentRover);
        console.log('final rover ' + currentRover.roverLocation.position_x + ', ' + currentRover.roverLocation.position_y + ', ' + currentRover.roverLocation.direction);
      });
    }
  }

  public isNullOrUndefined<T>(obj: T | null | undefined): obj is null | undefined {
    return typeof obj === 'undefined' || obj === null;
  }

  public roverStart(currentRover: any, instruction: any) {
    if (instruction === 'L') {
      currentRover.roverLocation.direction = this.turnLeft(currentRover);
    } else if (instruction === 'R') {
      currentRover.roverLocation.direction = this.turnRight(currentRover);
    } else {
      this.moveForward(currentRover);
    }
  }

  public turnLeft(currentRover: any) {
    switch (currentRover.roverLocation.direction) {
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

  public turnRight(currentRover: any) {
    switch (currentRover.roverLocation.direction) {
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

  public moveForward(currentRover: any) {
    switch (currentRover.roverLocation.direction) {
      case 'N': {
        currentRover.roverLocation.position_y++;
        break;
      }
      case 'S': {
        currentRover.roverLocation.position_y--;
        break;
      }
      case 'E': {
        currentRover.roverLocation.position_x++;
        break;
      }
      case 'W': {
        currentRover.roverLocation.position_x--;
        break;
      }
      default: break;
    }
  }
}
