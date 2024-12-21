# Simutation_prototype_haitu
1.启动nginx.exe,需要先配置nginx.conf文件，在/nginx-1.26.2/conf/nginx.conf中  

将  

location / {  

    root C:/Users/guotuluo/Desktop/prototype;  
    
    index index.html;  
    
}   



中的root修改为本地项目所在路径  

 
2.启动后端/BackEnd/src/main/java/com/haitu/prototype/PrototypeApplication.java

3.启动前端index.html
