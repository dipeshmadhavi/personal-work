import { Component, Input, Output ,
    EventEmitter
} from "@angular/core";


@Component({
    selector: "grid-ui",
    templateUrl : "./UserControl.Grid.html"
})
export class GridComponent{
 gridColumns: Array<Object> = new Array<Object>();
 gridData: Array<Object> = new Array<Object>();

 @Input("grid-columns")
    set setgridColumns(_gridColumns: Array<Object>) {
            this.gridColumns = _gridColumns;
        }
    
    @Input("grid-data")
    set setgridDataSet(_gridData: Array<Object>) {
            this.gridData = _gridData;
        }
    
    @Output("grid-selected")
    selected: EventEmitter<Object> = new EventEmitter<Object>();

    SelectGrid(_selected: Object) {
        this.selected.emit(_selected);
    }
    
}