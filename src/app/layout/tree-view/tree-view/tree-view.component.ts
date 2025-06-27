import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlattener, MatTreeFlatDataSource, MatTreeModule } from '@angular/material/tree';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface UrlNode {
  name: string;
  url?:string;
  children?: UrlNode[];
}

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

const TREE_DATA: UrlNode[] = [
  {
    name: 'Administración',
    //children: [{name: 'Clientes', url: INTERNAL_ROUTES.ABM_DEFAULT}],
  },
];

@Component({
  selector: 'app-tree-view',
  imports: [
    MatTreeModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './tree-view.component.html',
  styleUrl: './tree-view.component.css'
})
export class TreeViewComponent {
  private _transformer = (node: UrlNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  //constructor( public sideBarService: SideBarService,
            //   public router:Router ) {
   // this.dataSource.data = TREE_DATA;
 // }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  goToChild(node:FlatNode){
    switch(node.name){
      case "Clientes":  
      //  return this.router.navigateByUrl(INTERNAL_ROUTES.ABM_DEFAULT);
      default: return ;
    }
  }
}