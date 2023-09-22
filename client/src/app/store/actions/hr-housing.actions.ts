import { createAction, props } from '@ngrx/store';
import { Housing } from 'src/app/models/housing.interface';

export const showHouseDetails = createAction(
  '[Housing] Show House Details',
  props<{ houseId: string }>()
);

export const updateHouses = createAction(
  '[Housing] Update Houses',
  props<{ houses: Housing[] }>()
);

export const updateEmployeeHouse = createAction(
  '[Housing] Update Employee House',
  props<{ house: Housing }>()
);