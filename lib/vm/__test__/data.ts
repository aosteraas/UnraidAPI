export const vmHtml = `<tr parent-id="0" class="sortable">
  <td class="vm-name" style="width: 220px; padding: 8px">
    <span class="outer"
      ><span id="vm-1d608caf-a589-395f-121a-c6c70f9abac6" class="hand"
        ><img
          src="/plugins/dynamix.vm.manager/templates/images/ubuntu.png"
          class="img" /></span
      ><span class="inner"
        ><a
          href="#"
          onclick='return toggle_id("name-0")'
          title="click for more VM info"
          >Lubuntu</a
        ><br /><i class="fa fa-square stopped red-text"></i
        ><span class="state">stopped</span></span
      ></span
    >
  </td>
  <td></td>
  <td>
    <a class="vcpu-1d608caf-a589-395f-121a-c6c70f9abac6" style="cursor: pointer"
      >2</a
    >
  </td>
  <td>4096M</td>
  <td title="Current physical size: 20G">1 / 20G</td>
  <td>VNC:auto</td>
  <td>
    <input
      class="autostart"
      type="checkbox"
      name="auto_Lubuntu"
      title="Toggle VM autostart"
      uuid="1d608caf-a589-395f-121a-c6c70f9abac6"
    />
  </td>
</tr>
<tr child-id="0" id="name-0" style="display: none">
  <td colspan="8" style="margin: 0; padding: 0">
    <table class="tablesorter domdisk" id="domdisk_table">
      <thead>
        <tr>
          <th><i class="fa fa-hdd-o"></i> <b>Disk devices</b></th>
          <th>Bus</th>
          <th>Capacity</th>
          <th>Allocation</th>
        </tr>
      </thead>
      <tbody id="domdisk_list">
        <tr>
          <td>/mnt/disks/vms/Lubuntu/vdisk1.img</td>
          <td>VirtIO</td>
          <td title="Click to increase Disk Size">
            <form method="get" action="">
              <input type="hidden" name="subaction" value="disk-resize" /><input
                type="hidden"
                name="uuid"
                value="1d608caf-a589-395f-121a-c6c70f9abac6"
              /><input
                type="hidden"
                name="disk"
                value="/mnt/disks/vms/Lubuntu/vdisk1.img"
              /><input type="hidden" name="oldcap" value="20G" /><span
                class="diskresize"
                style="width: 30px"
                ><span class="text"
                  ><a href="#" onclick="return false">20G</a></span
                ><input
                  class="input"
                  type="text"
                  style="width: 46px"
                  name="cap"
                  value="20G"
                  val="diskresize"
                  hidden
              /></span>
            </form>
          </td>
          <td>19G</td>
        </tr>
        <tr>
          <td>/mnt/user/isos/lubuntu-20.10-desktop-amd64.iso</td>
          <td>SATA</td>
          <td>2G</td>
          <td>2G</td>
        </tr>
      </tbody>
    </table>
  </td>
</tr>
<tr parent-id="1" class="sortable">
  <td class="vm-name" style="width: 220px; padding: 8px">
    <span class="outer"
      ><span id="vm-3c15a77b-7917-514e-91e5-3aa32c29f919" class="hand"
        ><img
          src="/plugins/dynamix.vm.manager/templates/images/ubuntu.png"
          class="img" /></span
      ><span class="inner"
        ><a
          href="#"
          onclick='return toggle_id("name-1")'
          title="click for more VM info"
          >Ubuntu</a
        ><br /><i class="fa fa-square stopped red-text"></i
        ><span class="state">stopped</span></span
      ></span
    >
  </td>
  <td></td>
  <td>
    <a class="vcpu-3c15a77b-7917-514e-91e5-3aa32c29f919" style="cursor: pointer"
      >1</a
    >
  </td>
  <td>1024M</td>
  <td title="Current physical size: 2G">1 / 2G</td>
  <td>VNC:auto</td>
  <td>
    <input
      class="autostart"
      type="checkbox"
      name="auto_Ubuntu"
      title="Toggle VM autostart"
      uuid="3c15a77b-7917-514e-91e5-3aa32c29f919"
    />
  </td>
</tr>
<tr child-id="1" id="name-1" style="display: none">
  <td colspan="8" style="margin: 0; padding: 0">
    <table class="tablesorter domdisk" id="domdisk_table">
      <thead>
        <tr>
          <th><i class="fa fa-hdd-o"></i> <b>Disk devices</b></th>
          <th>Bus</th>
          <th>Capacity</th>
          <th>Allocation</th>
        </tr>
      </thead>
      <tbody id="domdisk_list">
        <tr>
          <td>/mnt/disks/vms/Ubuntu/vdisk1.img</td>
          <td>VirtIO</td>
          <td title="Click to increase Disk Size">
            <form method="get" action="">
              <input type="hidden" name="subaction" value="disk-resize" /><input
                type="hidden"
                name="uuid"
                value="3c15a77b-7917-514e-91e5-3aa32c29f919"
              /><input
                type="hidden"
                name="disk"
                value="/mnt/disks/vms/Ubuntu/vdisk1.img"
              /><input type="hidden" name="oldcap" value="2G" /><span
                class="diskresize"
                style="width: 30px"
                ><span class="text"
                  ><a href="#" onclick="return false">2G</a></span
                ><input
                  class="input"
                  type="text"
                  style="width: 46px"
                  name="cap"
                  value="2G"
                  val="diskresize"
                  hidden
              /></span>
            </form>
          </td>
          <td>1M</td>
        </tr>
      </tbody>
    </table>
  </td>
</tr>
addVMContext('Lubuntu','1d608caf-a589-395f-121a-c6c70f9abac6','Ubuntu','shutoff','','');addVMContext('Ubuntu','3c15a77b-7917-514e-91e5-3aa32c29f919','Ubuntu','shutoff','','');var
kvm=[];kvm.push({id:'1d608caf-a589-395f-121a-c6c70f9abac6',state:'shutoff'});kvm.push({id:'3c15a77b-7917-514e-91e5-3aa32c29f919',state:'shutoff'});`;
