Add these lines in the network interface

```xml
<portForward proto="tcp">
  <range start="4022" to="22"/>
</portForward>
<backend type="passt"/>
```
