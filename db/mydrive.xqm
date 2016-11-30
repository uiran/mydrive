(:~
 : My Drive - API
 :
 : Implementação da MyDriveAPI em RESTXQ
 :
 :
 : RESTXQ 1.0: RESTful Annotations for XQuery
 : http://exquery.github.io/exquery/exquery-restxq-specification/restxq-1.0-specification.html
 : 
 :)
module namespace mydrive = 'http://mydrive.com';

declare namespace uuid = "java:java.util.UUID";

declare variable $mydrive:header as element(rest:response) :=
  <rest:response>
    <http:response status="200">
      <http:header name="Content-Language" value="en"/>
      <http:header name="Access-Control-Allow-Origin" value="*"/>
      <http:header name="Access-Control-Allow-Methods" value="POST, PUT, GET, OPTIONS, DELETE"/>
      <http:header name="Access-Control-Allow-Headers" value="content-type"/>      
      <http:header name="Content-Type" value="application/json; charset=utf-8"/>
     </http:response>
  </rest:response>;

(: ============================================
 : Enable CORS
 : Method : OPTIONS
 : Path   : /mydrive/{$path=.+}
 : ========================================= :)
declare
    %rest:OPTIONS
    %rest:path("/mydrive/{$path=.+}")
function mydrive:cors($path) as item()* {
    $mydrive:header
};

(: ============================================
 : Add a new folder
 : Method : POST
 : Path   : /mydrive/folder
 : ========================================= :)
declare
    %rest:POST("{$body}")
    %rest:consumes("application/json")
    %rest:path("/mydrive/folder")
    %updating
function mydrive:create-folder($body as document-node()) {
    db:output($mydrive:header),
    let $id := replace(uuid:randomUUID(),"-","")
    return
    db:add("mydrive",
        <folder id="{$id}" name="{$body}" created="{current-dateTime()}"/>, 
        "folders")
};

(: ============================================
 : Update a folder
 : Method : PUT
 : Path   : /mydrive/folder/{$id}
 : ========================================= :)
declare
    %rest:PUT("{$body}")
    %rest:consumes("application/json")
    %rest:path("/mydrive/folder/{$id}")
    %updating
function mydrive:update-folder($id, $body as document-node()) {
    db:output($mydrive:header),
    let $folder := mydrive:retrieve-folder($id)
    return
    replace value of node $folder/@name with $body/*/name 
};

(: ============================================
 : Get the folder list
 : Method : GET
 : Path   : /mydrive/folders
 : ========================================= :)
declare
    %rest:GET
    %rest:path("/mydrive/folders")
    %output:method("json")
    %output:json("format=jsonml")    
function mydrive:retrieve-folders() as item()* {
    $mydrive:header,
    <folders>{
        for $folder in collection("/mydrive/folders")/folder
        return element folder {$folder/@*}
    }</folders>
};

(: ============================================
 : Get the folder details
 : Method : GET
 : Path   : /mydrive/folder/{$id}
 : ========================================= :)
declare
    %rest:GET
    %rest:path("/mydrive/folder/{$id}")
    %output:method("json")
    %output:json("format=jsonml")    
function mydrive:retrieve-folder($id) as item()* {
    $mydrive:header,
    collection("/mydrive/folders")/folder[@id = $id]
};

(: ============================================
 : Delete folder
 : Method : DELETE
 : Path   : /mydrive/folders/{$id}
 : ========================================= :)
declare
    %rest:DELETE
    %rest:path("/mydrive/folders/{$id}")
    %updating
function mydrive:delete-folder($id) {
    db:output($mydrive:header),
    let $folder := mydrive:retrieve-folder($id)
    return delete node $folder
};

(: ============================================
 : Add a new file
 : Method : POST
 : Path   : /mydrive/folder/{$id}/upload
 : ========================================= :)
declare
    %rest:POST
    %rest:path("/mydrive/folder/{$id}/upload")
    %rest:form-param("files", "{$files}")    
    %updating
function mydrive:upload($id, $files) {
    db:output($mydrive:header),
    for $name    in map:keys($files)
    let $fileId  := replace(uuid:randomUUID(),"-","")
    let $content := $files($name)
    let $folder  := mydrive:getfolder($id)
    let $rsPath  := "resources/" || $id || "/" || $fileId
    let $fsPath  := file:temp-dir() || $name  
    return (
        file:write-binary($fsPath, $content),
        db:store("mydrive", $rsPath, $content),
        insert node 
            <file id="{$fileId}" name="{$name}" 
                created="{current-dateTime()}"
                size="{file:size($fsPath)}" 
                type="{fetch:content-type($fsPath)}"/>
        into $folder,
        file:delete($fsPath)
    )
};

(: ============================================
 : Delete file
 : Method : DELETE
 : Path   : /mydrive/folder/{$id}/file/{$fileId}
 : ========================================= :)
declare
    %rest:DELETE
    %rest:path("/mydrive/folder/{$id}/file/{$fileId}")
    %updating
function mydrive:delete-file($id, $fileId) {
    let $folder := mydrive:retrieve-file($id, $fileId)
    return delete node $folder
};

(: ============================================
 : Get the file details
 : Method : GET
 : Path   : /mydrive/folder/{$id}/file/{$fileId}
 : ========================================= :)
declare
    %rest:GET
    %rest:path("/mydrive/folder/{$id}/file/{$fileId}")
function mydrive:retrieve-file($id, $fileId) as element(file)? {
    collection("/mydrive/folders")/folder[@id = $id]/file[@id = $fileId]
};

(: ============================================
 : Get the file list
 : Method : GET
 : Path   : /mydrive/folder/{$id}/files
 : ========================================= :)
declare
    %rest:GET
    %rest:path("/mydrive/folder/{$id}/files")
function mydrive:retrieve-files($id) as element(files) {
    <files>{
        mydrive:retrieve-folder($id)/file
    }</files>
};

(: ============================================
 : Get the folder
 : ========================================= :)
declare function mydrive:getfolder(
    $id as xs:string?) as element(folder) {
    collection("/mydrive/folders")/folder[@id = $id]
};
