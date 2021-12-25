import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  constructor(private http:HttpClient,private sanitizer:DomSanitizer) { }

  departments:any=[];
  employees:any=[];

  modalTitle="";
  EmployeeId=0;
  EmployeeName="";
  Department="";
  DateOfJoining="";
  PhotoFileName="none.jpg";
  PhotoPath=environment.PHOTO_URL;

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList(){
    this.http.get<any>(environment.API_URL+'employee')
    .subscribe(data=>{
      this.employees=data;
    });

    this.http.get<any>(environment.API_URL+'department')
    .subscribe(data=>{
      this.departments=data;
    });
  }

  addClick(){
    this.modalTitle="Add Employee";
    this.EmployeeId=0;
    this.EmployeeName="";
    this.Department="";
    this.DateOfJoining="";
    this.PhotoFileName="none.jpg";
  }

  editClick(emp:any){
    this.modalTitle="Edit Employee";
    this.EmployeeId=emp.EmployeeId;
    this.EmployeeName=emp.EmployeeName;
    this.Department=emp.Department;
    this.DateOfJoining=emp.DateOfJoining;
    this.PhotoFileName=emp.PhotoFileName;
  }

  createClick(){
    var val={
      EmployeeName:this.EmployeeName,
      Department:this.Department,
      DateOfJoining:this.DateOfJoining,
      PhotoFileName:this.PhotoFileName
    };

    this.http.post(environment.API_URL+'employee',val)
    .subscribe(res=>{
      alert(res.toString());
      this.refreshList();
    });
  }

  updateClick(){
    var val={
      EmployeeId:this.EmployeeId,
      EmployeeName:this.EmployeeName,
      Department:this.Department,
      DateOfJoining:this.DateOfJoining,
      PhotoFileName:this.PhotoFileName
    };

    this.http.put(environment.API_URL+'employee',val)
    .subscribe(res=>{
      alert(res.toString());
      this.refreshList();
    });
  }

  deleteClick(id:any){
    if(confirm("Are You Sure To Delete?"))
    {
      this.http.delete(environment.API_URL+'employee/'+id)
      .subscribe(res=>{
        alert(res.toString());
        this.refreshList();
      });
    }
  }

  imageUpload(event:any)
  {
    var file =event.target.files[0];
    const formData:FormData=new FormData();
    formData.append('file',file,file.name);

    this.http.post(environment.API_URL+'employee/savefile',formData)
    .subscribe((data:any)=>{
      this.PhotoFileName=data.toString();
    });
  }

  getSafeUrl(imageUrl:string):SafeUrl{
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }
}
