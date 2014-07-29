Ext = window.Ext4 || window.Ext

Ext.require [
  'Rally.apps.kanban.RowSettingsField'
]

describe 'Rally.apps.kanban.RowSettingsField', ->
  helpers
    createField: ->
      @field = Ext.create 'Rally.apps.kanban.RowSettingsField', {
        renderTo: 'testDiv'
        value:
          showRows: true
          rowsField: 'c_ClassOfService'
      }

  it 'should set initial value to config', ->
    @createField()
    data = @field.getSubmitData()
    expect(data.showRows).toBe true
    expect(data.rowsField).toEqual 'c_ClassOfService'

  it 'should not return rowsField value if not checked', ->
    @createField()
    @field.down('rallycheckboxfield').setValue false
    data = @field.getSubmitData()
    expect(data.showRows).toBe false
    expect(data.rowsField).toBeUndefined()
